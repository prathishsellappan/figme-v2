import { CircuitBreaker } from './CircuitBreaker';

export class ConnectivityGuard {
  public firebaseBreaker = new CircuitBreaker();
  public liveblocksBreaker = new CircuitBreaker();

  async checkFirebase() {
    try {
      await fetch('https://firebase.google.com/favicon.ico', { mode: 'no-cors' });
      this.firebaseBreaker.recordSuccess();
      return true;
    } catch (e) {
      this.firebaseBreaker.recordFailure();
      return false;
    }
  }

  async checkLiveblocks() {
    try {
       await fetch('https://liveblocks.io/favicon.ico', { mode: 'no-cors' });
       this.liveblocksBreaker.recordSuccess();
       return true;
    } catch (e) {
       this.liveblocksBreaker.recordFailure();
       return false;
    }
  }
}

export const globalConnectivityGuard = new ConnectivityGuard();
