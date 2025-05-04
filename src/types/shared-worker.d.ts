interface SharedWorkerGlobalScope extends Worker {
  onconnect: (event: MessageEvent) => void;
}

declare let self: SharedWorkerGlobalScope;
