# Documentação da API

## Autenticação

Todas as requisições da API requerem autenticação via token JWT no header Authorization.

**Header:**
```
Authorization: Bearer <access_token>
```

### Login
**POST** `/api/auth/login/`
Autentica o usuário e retorna tokens de acesso.

**Parâmetros:**
- `username` (string, obrigatório): Nome de usuário
- `password` (string, obrigatório): Senha do usuário

### Refresh Token
**POST** `/api/auth/token/refresh/`
Renova o token de acesso usando o refresh token.

---

## Products

### Listar produtos
**GET** `/api/products/`
Retorna lista paginada de produtos do usuário logado.

### Obter produto
**GET** `/api/products/{id}/`
Retorna detalhes de um produto específico.

### Criar produto
**POST** `/api/products/`
Cria um novo produto.

**Parâmetros:**
- `name` (string, obrigatório): Nome do produto
- `price` (number, obrigatório): Preço do produto

### Atualizar produto
**PUT/PATCH** `/api/products/{id}/`
Atualiza dados de um produto existente.

### Remover produto
**DELETE** `/api/products/{id}/`
Remove um produto.

### Meus produtos
**GET** `/api/products/my_products/`
Retorna produtos criados pelo usuário logado.

---

## Sales

### Listar vendas
**GET** `/api/sales/`
Retorna lista paginada de vendas.

### Obter venda
**GET** `/api/sales/{id}/`
Retorna detalhes de uma venda específica.

### Criar venda
**POST** `/api/sales/`
Cria uma nova venda com itens.

**Parâmetros:**
- `items` (array, obrigatório): Lista de itens da venda
  - `product_id` (integer, obrigatório): ID do produto
  - `quantity` (integer, obrigatório): Quantidade do produto

### Atualizar venda
**PUT/PATCH** `/api/sales/{id}/`
Atualiza dados de uma venda existente.

### Remover venda
**DELETE** `/api/sales/{id}/`
Remove uma venda.

### Venda com compras
**GET** `/api/sales/{id}/with_purchases/`
Retorna uma venda com todas as compras relacionadas.

### Vendas com status
**GET** `/api/sales/with_status/`
Retorna todas as vendas com status de compra.

---

## Purchases

### Listar compras
**GET** `/api/purchases/`
Retorna lista paginada de compras.

### Obter compra
**GET** `/api/purchases/{id}/`
Retorna detalhes de uma compra específica.

### Criar compra
**POST** `/api/purchases/`
Cria uma nova compra com itens.

**Parâmetros:**
- `sale` (integer, obrigatório): ID da venda relacionada
- `items` (array, obrigatório): Lista de itens da compra
  - `product_id` (integer, obrigatório): ID do produto
  - `quantity` (integer, obrigatório): Quantidade do produto

---

## Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Dados inválidos na requisição
- **401 Unauthorized**: Token de acesso inválido ou ausente
- **403 Forbidden**: Usuário sem permissão para a operação
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

---