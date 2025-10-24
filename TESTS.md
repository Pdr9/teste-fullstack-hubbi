# Testes

Este documento explica como executar os testes do Sistema de Gestão de Vendas e Compras.

## Testes com Docker (Recomendado)

### Backend (Django)

```bash
# Executar todos os testes
docker-compose exec backend python manage.py test

# Executar testes de um app específico
docker-compose exec backend python manage.py test products
docker-compose exec backend python manage.py test sales
docker-compose exec backend python manage.py test purchases

# Executar um teste específico
docker-compose exec backend python manage.py test products.tests.ProductTestCase.test_create_product

# Executar com verbose (mais detalhes)
docker-compose exec backend python manage.py test --verbosity=2

# Manter banco de dados entre testes (mais rápido)
docker-compose exec backend python manage.py test --keepdb
```

### Comandos Úteis

```bash
# Ver logs dos testes
docker-compose logs backend

# Listar arquivos de teste
docker-compose exec backend find . -name "test*.py"

# Ver estrutura dos testes
docker-compose exec backend python manage.py test --dry-run
```

## Testes sem Docker (Instalação Local)

### Backend (Django)

```bash
# Todos os testes
python manage.py test

# Testes específicos
python manage.py test products
python manage.py test sales
python manage.py test purchases

# Com verbose
python manage.py test --verbosity=2

# Com keepdb
python manage.py test --keepdb
```
