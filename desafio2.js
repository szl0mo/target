const readline = require('readline')
const { randomUUID } = require('crypto')
const leDados = require('./utils')

const CAMINHO_DADOS = './dados/dados2.json'

const dados = leDados(CAMINHO_DADOS)

const movimentacoes = []

function movimentar(codigo, tipo, quantidade, descricao) {
	const produto = dados.estoque.find((p) => p.codigoProduto === codigo)
	if (!produto) throw new Error(`Produto ${codigo} não encontrado.`)

	if (tipo !== 'entrada' && tipo !== 'saida') {
		throw new Error('Tipo inválido. Use "entrada" ou "saida".')
	}

	if (!Number.isInteger(quantidade) || quantidade <= 0) {
		throw new Error('A quantidade deve ser um número inteiro maior que zero.')
	}
	if (!descricao || !descricao.trim()) {
		throw new Error('A descrição da movimentação é obrigatória.')
	}
	if (tipo === 'saida' && quantidade > produto.estoque) {
		throw new Error(
			`Estoque insuficiente. Disponível: ${produto.estoque}, solicitado: ${quantidade}.`
		)
	}

	produto.estoque += tipo === 'entrada' ? quantidade : -quantidade

	const movimentacao = {
		id: randomUUID(),
		codigoProduto: codigo,
		tipo,
		quantidade,
		descricao: descricao.trim(),
		data: new Date().toISOString(),
	}
	movimentacoes.push(movimentacao)

	return {
		movimentacao,
		estoqueFinal: produto.estoque,
		produto: produto.descricaoProduto
	}
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const perguntar = (texto) => new Promise((resolve) => rl.question(texto, resolve))

async function main() {
	console.log('Controle de Estoque')
	let continuar = true

	while (continuar) {
		console.log('\nProdutos:')
    		dados.estoque.forEach((p) =>
			console.log(`  ${p.codigoProduto} - ${p.descricaoProduto} (estoque: ${p.estoque})`)
    		)

		try {
			const codigo = Number(await perguntar('\nCódigo do produto: '))
			const tipo = (await perguntar('Tipo (entrada/saida): ')).trim().toLowerCase()
			const quantidade = Number(await perguntar('Quantidade: '))
			const descricao = await perguntar('Descrição (ex: Venda balcão): ')

			const r = movimentar(codigo, tipo, quantidade, descricao)
			console.log('\nMovimentação registrada!')
			console.log(`ID: ${r.movimentacao.id}`)
			console.log(`${r.produto}: estoque final = ${r.estoqueFinal}`)
		} catch (erro) {
			console.log(`\nErro: ${erro.message}`)
		}

		const resp = await perguntar('\nNova movimentação? (s/n): ')
		continuar = resp.trim().toLowerCase() === "s"
	}
	console.log(`\nTotal de movimentações na sessão: ${movimentacoes.length}`)
	rl.close()
}

main()
