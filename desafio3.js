const readline = require('readline')

const TAXA_DIARIA = 0.025
const MS_DIA = 24 * 60 * 60 * 1000

function parseData(texto) {
	const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto.trim())
	if (!m) return null
	const [, dia, mes, ano] = m.map(Number)
	const data = new Date(Date.UTC(ano, mes - 1, dia))
	const valida =
		data.getUTCFullYear() === ano &&
		data.getUTCMonth() === mes - 1 
		data.getUTCDate() === dia
	return valida ? data : null
}

function hojeUTC() {
	const h = new Date()
	return new Date(Date.UTC(h.getFullYear(), h.getMonth(), h.getDate()))
}

function calcularJuros(valor, vencimento, hoje = hojeUTC()) {
	if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
		throw new Error('O valor deve ser um número maior que zero.')
  	}
  	if (!(vencimento instanceof Date) || isNaN(vencimento)) {
    		throw new Error('Data de vencimento inválida.')
  	}

	const diasAtraso = Math.max(0, Math.round((hoje - vencimento) / MS_DIA))
	const juros = valor * TAXA_DIARIA * diasAtraso

	return {
		diasAtraso,
		juros,
		total: valor + juros
	}
}

const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const perguntar = (t) => new Promise((resolve) => rl.question(t, resolve))

async function main() {
	console.log('Cálculo de juros por atraso (2,5% ao dia)\n')
	try {
		const valor = Number((await perguntar('Valor (ex: 1500,00): ')).replace(',', '.'))
		const venc = parseData(await perguntar('Data de vencimento (dd/mm/aaaa): '))

		if (!venc) throw new Error('Data inválida. Use o formato dd/mm/aaaa.')
		const r = calcularJuros(valor, venc)

		if (r.diasAtraso === 0) {
			console.log('\nSem atraso: não há juros a cobrar.')
		} else {
			console.log(`\nDias em atraso: ${r.diasAtraso}`)
			console.log(`Juros: ${brl(r.juros)}`)
			console.log(`Total a pagar: ${brl(r.total)}`)
		}
	} catch (e) {
		console.log(`\nErro: ${e.message}`)
	}
	rl.close()
}

main()
