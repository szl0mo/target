const fs = require('fs')

function leDados(caminhoArquivo) {
	try {
		const arquivo = fs.readFileSync(caminhoArquivo, 'utf-8')
		const dados = JSON.parse(arquivo)
		return dados
	} catch (erro) {
		console.log('Erro ao ler o arquivo:', erro)
	}
}

module.exports = leDados
