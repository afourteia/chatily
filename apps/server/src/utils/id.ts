import { init, isCuid } from '@paralleldrive/cuid2';

export { isCuid };

// The init function returns a custom createId function with the specified
// configuration. All configuration properties are optional.
export const createCUID = init({
  // A custom random function with the same API as Math.random.
  // You can use this to pass a cryptographically secure random function.
  random: Math.random,
  // the length of the id
  length: 20,
  // A custom fingerprint for the host environment. This is used to help
  // prevent collisions when generating ids in a distributed system.
  // fingerprint: 'host-fingerprint',
});
