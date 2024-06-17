const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, writeBatch, getDocs, query, limit, updateDoc, getDoc } = require("firebase/firestore"); // Import getDoc
const fs = require('fs');
const readline = require('readline');

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDM3K9KCv6KAVx3RoOK876HlC4RRlIQL1I",
    authDomain: "trabalhodebancodois.firebaseapp.com",
    projectId: "trabalhodebancodois",
    storageBucket: "trabalhodebancodois.appspot.com",
    messagingSenderId: "797934484172",
    appId: "1:797934484172:web:7cbac031dec32eb24be069"
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const rawData = fs.readFileSync('MOCK_DATA.json');
const data = JSON.parse(rawData);

function showMainMenu() {
  console.log('\n~~~~~~ Menu ~~~~~~');
  console.log('1. Firestore');
  console.log('2. RavenDB');
  console.log('3. MongoDB');
  console.log('4. Sair');
  rl.question('Escolha um banco de dados: ', (choiceBanco) => {
    handleDatabaseChoice(choiceBanco);
  });
}

function handleDatabaseChoice(choiceBanco) {
  switch (choiceBanco) {
    case '1':
      showFirestoreMenu();
      break;
    case '2':
      showRavenDBMenu();
      break;
    case '3':
      showMongoDBMenu();
      break;
    case '4':
      console.log('Saindo...');
      rl.close();
      break;
    default:
      console.log('Escolha inválida, tente novamente.');
      showMainMenu();
      break;
  }
}

function showFirestoreMenu() {
  console.log('\n~~~~~~ Firestore Menu ~~~~~~');
  console.log('1. Inserir dados');
  console.log('2. Consultar dados');
  console.log('3. Atualizar dados');
  console.log('4. Listar IDs dos documentos');
  console.log('5. Voltar');
  rl.question('Escolha uma opção: ', (choiceFuncao) => {
    handleFirestoreChoice(choiceFuncao);
  });
}

function showRavenDBMenu() {
  console.log('\n~~~~~~ RavenDB Menu ~~~~~~');
  console.log('1. Inserir dados');
  console.log('2. Consultar dados');
  console.log('3. Atualizar dados');
  console.log('4. Voltar');
  rl.question('Escolha uma opção: ', (choiceFuncao) => {
    handleRavenDBChoice(choiceFuncao);
  });
}

function showMongoDBMenu() {
  console.log('\n~~~~~~ MongoDB Menu ~~~~~~');
  console.log('1. Inserir dados');
  console.log('2. Consultar dados');
  console.log('3. Atualizar dados');
  console.log('4. Voltar');
  rl.question('Escolha uma opção: ', (choiceFuncao) => {
    handleMongoDBChoice(choiceFuncao);
  });
}

// Funções para operações no Firestore
async function insertDataFirestore() {
  console.log('Inserindo dados no Firestore...');
  console.time('importDataTime'); // Inicia a contagem do tempo

  const batch = writeBatch(firestore);
  const usersCollection = collection(firestore, 'users');

  data.forEach((item) => {
    const docRef = doc(usersCollection); // Cria um novo documento com um ID único
    batch.set(docRef, item);
  });

  try {
    await batch.commit();
    console.log('\n\n\nTodos os documentos foram inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir documentos: ', error);
  }

  console.timeEnd('importDataTime'); // Finaliza a contagem do tempo e imprime o resultado no console
  showFirestoreMenu();
}

async function queryDataFirestore() {
  console.log('Consultando dados no Firestore...');
  try { 
      const usersCollection = collection(firestore, 'users');
      const q = query(usersCollection, limit(50));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data());
      });
      showFirestoreMenu();
  } catch (error) {
      console.error('Erro ao consultar documentos: ', error);
      showFirestoreMenu();
  }
}

async function updateDataFirestore() {
  console.log('Atualizando dados no Firestore...');
  rl.question('Digite o ID do documento que deseja atualizar: ', async (docId) => {
    rl.question('Digite os novos dados (formato JSON): ', async (newDataStr) => {
      try {
        const newData = JSON.parse(newDataStr);
        const docRef = doc(firestore, 'users', docId); // Use the doc function to get the reference to the document
        const docSnapshot = await getDoc(docRef); // Verifica se o documento existe

        if (docSnapshot.exists()) {
          await updateDoc(docRef, newData); // Usar updateDoc para atualizar o documento
          console.log('Documento atualizado com sucesso!');
        } else {
          console.log('Documento não encontrado!');
        }
      } catch (error) {
        console.error('Erro ao atualizar documento: ', error);
      }
      showFirestoreMenu();
    });
  });
}

// Funções para operações no RavenDB
function insertDataRavenDB() {
  console.log('Inserindo dados no RavenDB...');
  // Implementação específica para RavenDB
}

function queryDataRavenDB() {
  console.log('Consultando dados no RavenDB...');
  // Implementação específica para RavenDB
}

function updateDataRavenDB() {
  console.log('Atualizando dados no RavenDB...');
  // Implementação específica para RavenDB
}

// Funções para operações no MongoDB (exemplo: placeholders)
function insertDataMongoDB() {
  console.log('Inserindo dados no MongoDB...');
  // Implementação específica para MongoDB
}

function queryDataMongoDB() {
  console.log('Consultando dados no MongoDB...');
  // Implementação específica para MongoDB
}

function updateDataMongoDB() {
  console.log('Atualizando dados no MongoDB...');
  // Implementação específica para MongoDB
}


function handleFirestoreChoice(choiceFuncao) {
  switch (choiceFuncao) {
    case '1':
      insertDataFirestore();
      break;
    case '2':
      queryDataFirestore();
      break;
    case '3':
      updateDataFirestore();
      break;
    case '4':
      listDocumentIDs();
      break;
    case '5':
      showMainMenu();
      break;
    default:
      console.log('Escolha inválida, tente novamente.');
      showFirestoreMenu();
      break;
  }
}

function handleRavenDBChoice(choiceFuncao) {
  switch (choiceFuncao) {
    case '1':
      insertDataRavenDB();
      break;
    case '2':
      queryDataRavenDB();
      break;
    case '3':
      updateDataRavenDB();
      break;
    case '4':
      showMainMenu();
      break;
    default:
      console.log('Escolha inválida, tente novamente.');
      showRavenDBMenu();
      break;
  }
}

function handleMongoDBChoice(choiceFuncao) {
  switch (choiceFuncao) {
    case '1':
      insertDataMongoDB();
      break;
    case '2':
      queryDataMongoDB();
      break;
    case '3':
      updateDataMongoDB();
      break;
    case '4':
      showMainMenu();
      break;
    default:
      console.log('Escolha inválida, tente novamente.');
      showMongoDBMenu();
      break;
  }
}

showMainMenu();