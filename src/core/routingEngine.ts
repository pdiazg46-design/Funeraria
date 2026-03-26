// Implementación del Motor de Búsqueda de Rutas (Dijkstra) y Reglas de Negocio RM

// Grafo de Adyacencia: { "ID_COMUNA": [ { destino: "ID_COMUNA", kilometros: 15.5 }, ... ] }
export type Graph = Record<string, { target: string; weight: number }[]>;

/**
 * Valida si TODAS las comunas pasadas pertenecen a la Región Metropolitana (ID: 13, por ejemplo)
 */
export function isFullyRM(comunas: { regionId: number }[]): boolean {
  const REGION_METROPOLITANA_ID = 13; // Ajustable según seed
  return comunas.every(c => c && c.regionId === REGION_METROPOLITANA_ID);
}

/**
 * Motor de Cálculo Base usando Algoritmo de Dijkstra para la ruta más corta
 */
export function calculateShortestPathDistance(graph: Graph, startNode: string, endNode: string): number {
  if (startNode === endNode) return 0;

  const distances: Record<string, number> = {};
  const visited: Record<string, boolean> = {};
  const queue: string[] = [];

  // Iniciamos a infinito
  for (const node in graph) {
    distances[node] = Infinity;
  }
  
  distances[startNode] = 0;
  queue.push(startNode);

  while (queue.length > 0) {
    // Extraer el nodo con menor distancia
    queue.sort((a, b) => distances[a] - distances[b]);
    const currentNode = queue.shift()!;

    if (currentNode === endNode) break;
    if (visited[currentNode]) continue;
    
    visited[currentNode] = true;

    const neighbors = graph[currentNode] || [];
    for (const neighbor of neighbors) {
      if (!visited[neighbor.target]) {
        const newDist = distances[currentNode] + neighbor.weight;
        if (newDist < distances[neighbor.target]) {
          distances[neighbor.target] = newDist;
          if (!queue.includes(neighbor.target)) {
            queue.push(neighbor.target);
          }
        }
      }
    }
  }

  return distances[endNode] !== Infinity ? distances[endNode] : -1; // -1 si no hay ruta físicamente
}

/**
 * LÓGICA CORE DE COTIZACIÓN (Backend Service)
 */
export interface RoutingParams {
  matrizGrafos: Graph;
  comunaOrigen: { id: string, regionId: number };
  comunaDestino1: { id: string, regionId: number };
  comunaDestino2?: { id: string, regionId: number } | null;
  configAdmin: {
    valorPorKm: number; // $1000 CLP estricto según regla
    tarifaPlanaRM: number; // Ej: $150.000 CLP
    activaTarifaPlana: boolean;
  };
  kilometrosRuralesExtra?: number; // Valor forzado por administrador para última milla
}

export function cotizarServicio(params: RoutingParams) {
  const { matrizGrafos, comunaOrigen, comunaDestino1, comunaDestino2, configAdmin, kilometrosRuralesExtra = 0 } = params;
  
  // 1. Array de comunas involucradas
  const comunasInvolucradas = [comunaOrigen, comunaDestino1];
  if (comunaDestino2) comunasInvolucradas.push(comunaDestino2);

  // 2. Evaluamos la regla RM
  const esCompletamenteRM = isFullyRM(comunasInvolucradas);
  
  if (esCompletamenteRM && configAdmin.activaTarifaPlana) {
    return {
      exito: true,
      tipoCalculo: 'TARIFA_PLANA_RM',
      totalKilometros: 0,
      costoTotalFinalCLP: configAdmin.tarifaPlanaRM,
      desglose: "Tarifa Plana Región Metropolitana Aplicada."
    };
  }

  // 3. Calculamos distancias con Dijkstra (Tramo 1: Origen -> Destino 1)
  let totalKmCalculados = calculateShortestPathDistance(matrizGrafos, comunaOrigen.id, comunaDestino1.id);
  
  // Tramo 2 (Destino 1 -> Destino 2)
  if (comunaDestino2) {
    const kmTramo2 = calculateShortestPathDistance(matrizGrafos, comunaDestino1.id, comunaDestino2.id);
    if (kmTramo2 === -1) throw new Error("Aislamiento de red: No hay rutas al Destino 2");
    totalKmCalculados += kmTramo2;
  }

  if (totalKmCalculados < 0) {
    throw new Error("Aislamiento de red: No hay rutas desde el Origen al Destino 1");
  }

  // 4. Lógica de Última Milla (Costos Rurales) y Multiplicador
  const kilometrajeTotalFinal = totalKmCalculados + kilometrosRuralesExtra;
  const costoTotalFinalCLP = kilometrajeTotalFinal * configAdmin.valorPorKm;

  return {
    exito: true,
    tipoCalculo: 'ALGORITMO_DIJKSTRA',
    totalKilometros: kilometrajeTotalFinal,
    distanciaRutaOrigenDst1: calculateShortestPathDistance(matrizGrafos, comunaOrigen.id, comunaDestino1.id),
    kilometrosAdicionalesRurales: kilometrosRuralesExtra,
    costoTotalFinalCLP: costoTotalFinalCLP,
    desglose: `${totalKmCalculados}Km (Interregional) + ${kilometrosRuralesExtra}Km (Rural Adicional) * $${configAdmin.valorPorKm} CLP`
  };
}
