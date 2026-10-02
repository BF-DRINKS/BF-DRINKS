export type RegisterOrderInput = {
  idempotencyKey: string;
  nome: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  complemento: string;
  entrega: number;
};

export type RegisterOrderResult = {
  pedidoId: number;
  numeroPedido: number;
  quantidadePedidos: number;
};

export async function registerOrder(
  input: RegisterOrderInput,
): Promise<RegisterOrderResult> {
  const resposta = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const respostaTexto = await resposta.text();
  let dados: unknown = null;

  try {
    dados = respostaTexto ? JSON.parse(respostaTexto) : null;
  } catch {
    dados = null;
  }

  if (!resposta.ok) {
    const erro = dados as { message?: unknown } | null;
    throw new Error(
      typeof erro?.message === "string"
        ? erro.message
        : "Não foi possível registrar o pedido.",
    );
  }

  const resultado = dados as Partial<RegisterOrderResult> | null;

  if (
    !resultado ||
    typeof resultado.pedidoId !== "number" ||
    typeof resultado.numeroPedido !== "number" ||
    typeof resultado.quantidadePedidos !== "number"
  ) {
    throw new Error("O servidor retornou um registro de pedido inválido.");
  }

  return resultado as RegisterOrderResult;
}