declare module "crypto-js" {
  namespace CryptoJS {
    namespace lib {
      class WordArray {
        toString(encoder?: Encoder): string;
      }
    }

    // Supported encoders
    interface Encoder {
      stringify(wordArray: lib.WordArray): string;
      parse(str: string): lib.WordArray;
    }

    namespace enc {
      const Hex: Encoder;
      const Base64: Encoder;
      const Utf8: Encoder;
    }
  }

  export function MD5(message: string | CryptoJS.lib.WordArray): CryptoJS.lib.WordArray;

  export = CryptoJS;
}
