# Inicio do projeto

- Instalar o pacote NPM de cada banco

Firebase: **npm install firebase** 
mongoDB: **npm install ravendb**
ravenDB: **?** 

- Inicar os bancos MongoDD e Raven pelo arquivo docker-compose:
    - **Comando:** docker compose up -d

# O que falta fazer

- Inclusão das funções "Inserção", "Consulta" e "Atualização" para os bancos Mongo
- Testar cada uma das funcionalidades dentro do arquivo principal


# Exemplos de inserção

- Para cada banco um ID diferente. Para saber o ID de um registro no banco utilizar a opção de consulta de dados. Para o Firebase o ID é o primeiro registro do documento, para o RavenDB é o ultimo registro do documento.

```json

{
    {"first_name": "João", "last_name": "Silva", "email": "joao.silva@example.com", "status": "Active"}
}

```