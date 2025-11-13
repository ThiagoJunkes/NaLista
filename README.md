# NaLista
Back-End de uma lista de comprar feito em NodeJs



# Na raiz do projeto execute
# 1. Clona o repositório do whisper.cpp
git clone https://github.com/ggerganov/whisper.cpp.git

# 2. Entra na pasta
cd whisper.cpp

# 3. Baixa o modelo "medium". Você pode escolher outros como 'base', 'small', 'large'.
# Para Windows, se não tiver 'bash', pode ser necessário o Git Bash ou WSL.
bash ./models/download-ggml-model.sh medium

# 4. Compila o projeto.
# No Linux/macOS:
make
# No Windows (usando MinGW/MSYS2 ou similar):
# Abra o powerwhell como admistrador
# instale o wsl
wsl --install

sudo apt update

sudo apt install make
sudo apt install -y cmake build-essential

cd ~
mkdir projetos
cd projetos/

git clone https://github.com/ggerganov/whisper.cpp.git

cd whisper.cpp/

bash ./models/download-ggml-model.sh medium

make

# Teste 
./build/bin/whisper-cli -m models/ggml-medium.bin -f samples/jfk.wav

# Mover Arquivo Compilado e Modelo para pasta raiz do projeto
mkdir -p /mnt/{caminhoDoProjeto}/NaLista/whisper

cp ~/projetos/whisper.cpp/build/bin/whisper-cli /mnt/{caminhoDoProjeto}/NaLista/whisper/

cp ~/projetos/whisper.cpp/models/ggml-medium.bin /mnt/{caminhoDoProjeto}/NaLista/whisper/

# Teste Local
cd /mnt/{caminhoDoProjeto}/NaLista/whisper

./whisper-cli -m ggml-medium.bin -f ../ArquivoAudioTeste.mp3

# Rodando com Docker
# Certifique-se de que o Docker e o Docker Compose estão instalados.
# Após seguir os passos de 1 a 4 para ter o whisper-cli e o modelo na pasta /whisper,
# execute o seguinte comando na raiz do projeto:

docker-compose up --build
