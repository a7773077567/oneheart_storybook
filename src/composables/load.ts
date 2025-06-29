import { Loading } from 'quasar';

export function useLoad() {
  return {
    load,
  };
}

async function load(cb: () => Promise<void>) {
  try {
    Loading.show();
    await cb();
  }
  catch (err) {
    console.error(err);
  }
  finally {
    Loading.hide();
  }
}
