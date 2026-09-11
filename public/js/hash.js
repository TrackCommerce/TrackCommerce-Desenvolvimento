// Faz Hash

const cyrb53 = (str, seed = 0) => {
    // Inicializa dois acumuladores de 32 bits com constantes arbitrárias (números "mágicos") fundidas com a seed.
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;

    // Processa cada caractere da string
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i); // Obtém o código UTF-16 do caractere atual
        
        // Aplica operação XOR (^) e multiplica por constantes de dispersão para embaralhar os bits.
        // Math.imul garante a multiplicação inteira de 32 bits estilo C.
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    
    // Etapa de "Avalanche" (Avalanche Effect):
    // Garante que uma pequena alteração na entrada mude drasticamente o resultado final,
    // cruzando e misturando os estados de h1 e h2.
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    // Combina os dois inteiros de 32 bits (h1 e h2) em um único número de 53 bits.
    // (2097151 & h2) pega 21 bits de h2, multiplicando por 2^32 para deslocar à esquerda.
    // (h1 >>> 0) converte h1 para um inteiro não assinado de 32 bits.
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cyrb53 };
}