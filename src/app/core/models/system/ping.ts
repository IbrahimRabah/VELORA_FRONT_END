// GET /ping — the build plan leaves this interface's folder unassigned ("—"); placed in
// its own `system` folder rather than forced into one of the ten listed domains.
export interface PingResponse {
  status: string;
  service: string;
  time: string;
}
