const { initializeApp } = require("firebase/app")
const { getFirestore, collection, doc, writeBatch, getDocs, query, limit, updateDoc, getDoc } = require("firebase/firestore")
const { DocumentStore } = require("ravendb")
const { MongoClient } = require('mongodb')
const fs = require('fs')
const readline = require('readline')

// Configuracao do Firebase
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

// Configuracao do RavenDB
const store = new DocumentStore("http://localhost:8080", "testeRaven");
store.initialize();

// Configuracao do MongoDB
const mongoClient = new MongoClient('mongodb://localhost:27017')
let mongoDb;

async function initializeMongoDB() {
  try {
    await mongoClient.connect();
    mongoDb = mongoClient.db('testeMongo');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB', error);
  }
}
initializeMongoDB();

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
  console.log('4. Voltar');
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

// Funcoes para operacoes no Firestore
async function insertDataFirestore() {
  console.log('Inserindo dados no Firestore...');
  console.time('importDataTime');

  const batch = writeBatch(firestore);
  const testeCollection = collection(firestore, 'testeFirebase');

  data.forEach((item) => {
    const docRef = doc(testeCollection);
    batch.set(docRef, item);
  });

  try {
    await batch.commit();
    console.log('\n\n\nTodos os documentos foram inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir documentos: ', error);
  }

  console.timeEnd('importDataTime'); 
  showFirestoreMenu();
}

async function queryDataFirestore() {
  console.log('Consultando dados no Firestore...');
  try { 
      const usersCollection = collection(firestore, 'testeFirebase');
      const q = query(testeCollection, limit(50));
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
        const docRef = doc(firestore, 'testeFirebase', docId); 
        const docSnapshot = await getDoc(docRef); 

        if (docSnapshot.exists()) {
          await updateDoc(docRef, newData); 
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

// Funcoes para operacoes no RavenDB
async function insertDataRavenDB() {
  console.log('Inserindo dados no RavenDB...');

  const session = store.openSession();

  try {
    for (const item of data) {
      await session.store(item);
    }
    await session.saveChanges();
    console.log('Todos os documentos foram inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir documentos: ', error);
  }

  showRavenDBMenu();
}

async function queryDataRavenDB() {
  console.log('Consultando dados no RavenDB...');
  const session = store.openSession();

  try {
    const testeRaven = await session.query({ collection: '@empty' }).take(50).all();
    testeRaven.forEach(testeRaven => {
      console.log(testeRaven);
    });
  } catch (error) {
    console.error('Erro ao consultar documentos: ', error);
  }
  showRavenDBMenu();
}

async function updateDataRavenDB() {
  console.log('Atualizando dados no RavenDB...');
  rl.question('Digite o ID do documento que deseja atualizar: ', async (docId) => {
    rl.question('Digite os novos dados (formato JSON): ', async (newDataStr) => {
      const session = store.openSession();
      try {
        const newData = JSON.parse(newDataStr);
        const testeRaven = await session.load(docId);

        if (testeRaven) {
          Object.assign(testeRaven, newData);
          await session.saveChanges(); 
          console.log('Documento atualizado com sucesso!');
        } else {
          console.log('Documento não encontrado!');
        }
      } catch (error) {
        console.error('Erro ao atualizar documento: ', error);
      }
      showRavenDBMenu();
    });
  });
}

// Funcoes para operacoes no MongoDB
async function insertDataMongoDB() {
  console.log('Inserindo dados no MongoDB...');
  
  try {
    const collection = mongoDb.collection('testeMongo');
    await collection.insertMany(data);
    console.log('Todos os documentos foram inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir documentos: ', error);
  }
  showMongoDBMenu();
}

async function queryDataMongoDB() {
  console.log('Consultando dados no MongoDB...');
  
  try {
    const collection = mongoDb.collection('testeMongo');
    const results = await collection.find({}).limit(50).toArray();
    
    results.forEach(doc => {
      console.log(doc);
    });
  } catch (error) {
    console.error('Erro ao consultar documentos: ', error);
  }
  
  showMongoDBMenu();
}

async function updateDataMongoDB() {
  console.log('Atualizando dados no MongoDB...');
  rl.question('Digite o ID do documento que deseja atualizar: ', async (docId) => {
    rl.question('Digite os novos dados (formato JSON): ', async (newDataStr) => {
      try {
        const newData = JSON.parse(newDataStr);
        const collection = mongoDb.collection('testeMongo');
        
        const result = await collection.updateOne({ _id: docId }, { $set: newData });
        
        if (result.matchedCount > 0) {
          console.log('Documento atualizado com sucesso!');
        } else {
          console.log('Documento não encontrado!');
        }
      } catch (error) {
        console.error('Erro ao atualizar documento: ', error);
      }
      showMongoDBMenu();
    });
  });
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

