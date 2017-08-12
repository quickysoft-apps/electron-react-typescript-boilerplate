//var edge = require('edge');
import * as edge from 'edge';

export function getEdgeFunctionFromScript(script: string): any {
  return edge.func(script);
}
