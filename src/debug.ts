let uiDebug = false;

export function initDebug() {
  figma.ui.onmessage = (msg) => {
    if (msg.type === 'DEBUG_TOGGLE') {
      uiDebug = msg.enable;
      console.log('Debug mode:', uiDebug ? 'enabled' : 'disabled');
    }
  };
}

export function postLog(channel: string, payload: any) {
  // Always log to console
  console.log(`[${channel}]`, payload);
  console.log('sent-to-ui', { type: 'TIMELINE', channel, payload });

  // Forward to UI if present
  if (figma.ui) {
    // Always send TEST messages, and send others if debug is on or they're important
    if (channel === 'TEST' || uiDebug || channel === 'WARN' || channel === 'QA') {
      figma.ui.postMessage({ 
        type: 'TIMELINE', 
        channel, 
        payload 
      });
    }
  }
}
