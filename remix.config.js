/** @type {import('@remix-run/dev').AppConfig} */
export default {
  serverPlatform: "node",
  browserNodeBuiltinsPolyfill: {
    modules: {
      buffer: true,
      events: true,
      string_decoder: true,
      stream: true,
      assert: true,
      url: true,
      http: true,
      https: true,
      zlib: true,
      util: true,
      crypto: true,
    },
  },
};
