import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  NextOrObserver,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  User,
} from 'firebase/auth';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD8O13I9cBrfdBSO8800dyPoASyd7aBVvs',
  authDomain: 'speech-to-text-97033.firebaseapp.com',
  projectId: 'speech-to-text-97033',
  storageBucket: 'speech-to-text-97033.appspot.com',
  messagingSenderId: '19610473048',
  appId: '1:19610473048:web:1d7f590afbbd1e845cb02d',
  measurementId: 'G-Q7M4X9HKNF',
};

export const initFirebase = () => {
  const firebaseApp = initializeApp(firebaseConfig);

  return firebaseApp;
};

export const checkLogin = () => {
  const auth = getAuth();

  if (auth.currentUser) {
    return { token: auth.currentUser.getIdToken(), user: auth.currentUser };
  }
  return null;
};

export const signInGoogle = () => {
  const auth = getAuth();

  if (auth.currentUser) {
    return { token: auth.currentUser.getIdToken(), user: auth.currentUser };
  }

  const provider = new GoogleAuthProvider();

  return new Promise<{ token?: string; user: any }>((resolve, reject) => {
    setPersistence(auth, browserLocalPersistence).then(() =>
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          // The signed-in user info.
          const user = result.user;

          resolve({ token, user });
        })
        .catch((error) => {
          reject(error);
        }),
    );
  });
};

export const getFirebaseRedirectResult = async () => {
  const auth = getAuth();

  const result = await getRedirectResult(auth);

  if (result) {
    const user = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    return { token, user };
  }

  return null;
};

export const signOutGoogle = () => {
  const auth = getAuth();

  return auth.signOut();
};

export const getStorageDownloadURL = (url: string) => {
  const storage = getStorage();
  return getDownloadURL(ref(storage, url));
};

export const onFireAuthStateChanged = (cb: NextOrObserver<User>) => {
  const auth = getAuth();

  return onAuthStateChanged(auth, cb);
};

class Analytics {
  podcastInit() {
    this.logEvent('podcast init');
  }

  playAudio(epName: string) {
    this.logEvent('play audio', { epName });
  }

  playAudioEnd(epName: string) {
    this.logEvent('play audio end', { epName });
  }

  moreThan5mins(epName: string) {
    this.logEvent('more than 5mins', { epName });
  }

  closeEnd(epName: string) {
    this.logEvent('close end', { epName });
  }

  private logEvent(
    key: string,
    data?: Record<string, string | number | boolean>,
  ) {
    const auth = getAuth();
    const analytics = getAnalytics();

    logEvent(analytics, `[Storybook] ${key}`, {
      uid: auth.currentUser?.uid,
      displayName: auth.currentUser?.displayName,
      ...data,
    });
  }
}

export const firebaseAnalytics = new Analytics();
