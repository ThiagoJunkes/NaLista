import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Assume que a pasta 'whisper' e o áudio de teste estão na raiz do projeto,
   // que no container é /usr/src/app
   const projectRoot = '/usr/src/app';
   const whisperCli = path.join(projectRoot, 'whisper', 'whisper-cli');
   const modelPath = path.join(projectRoot, 'whisper', 'ggml-medium.bin');
   const audioTestFile = path.join(projectRoot, 'ArquivoAudioTeste.mp3');

export const transcribeAudioTeste = (req, res) => {
  // Comando para executar a transcrição.
  // O whisper-cli gera a saída de texto no stdout e outros logs no stderr.
  const command = `"${whisperCli}" -m "${modelPath}" -f "${audioTestFile}" -otxt`;

  try {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar o Whisper: ${error.message}`);
        console.error(`Stderr: ${stderr}`);
        return res.status(500).json({ message: 'Erro ao transcrever o áudio.', details: stderr });
      }

      // stdout contém o texto transcrito.
      return res.status(200).json({ transcription: stdout.trim() });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor ao tentar transcrever.' });
  }
};
