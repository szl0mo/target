const leDados = require('./utils')

const CAMINHO_DADOS = './dados/dados1.json'

function calculaComissao (valor) {
	if (valor < 100) return 0
	if (valor < 500) return valor * 0.01
	else return valor * 0.05
}

function filtraVendasVendedor (vendas, vendedor) {
	return vendas.filter(venda => venda.vendedor === vendedor)
}

function imprimeComissoes (comissoes) {
	for (const [vendedor, comissao] of Object.entries(comissoes)) {
	    console.log(`${vendedor}: R$ ${comissao.toFixed(2)}`)
	}
}

function main () {
	const dados = leDados(CAMINHO_DADOS)
	const vendas = dados.vendas
	const vendedores = [...new Set(vendas.map(item => item.vendedor))] 

	const comissoes = {}
	for (const vendedor of vendedores) {
		const vendasVendedor = filtraVendasVendedor(vendas, vendedor)
		const totalComissao = vendasVendedor.reduce(
			(total, venda) => total + calculaComissao(venda.valor),
			0
		)

		comissoes[vendedor] = totalComissao
	}

	console.log('Total de comissão de cada vendedor:\n')
	imprimeComissoes(comissoes)
}

main()
