"""
Funções de serviço compartilhadas entre apps.
Implementação simplificada sem over-engineering.
"""
from typing import List, Dict
from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from products.models import Product


def create_items_bulk(items_data: List[Dict], item_model, parent_field, parent_instance):
    """
    Cria múltiplos itens de forma eficiente usando bulk_create.
    
    Args:
        items_data: Lista com dados dos itens [{'product_id': 1, 'quantity': 2}, ...]
        item_model: Classe do model (SaleItem ou PurchaseItem)
        parent_field: Nome do campo pai ('sale' ou 'purchase')
        parent_instance: Instância do objeto pai (Sale ou Purchase)
    
    Returns:
        list: Lista de itens criados
    """
    # Buscar produtos de uma vez
    product_ids = [item['product_id'] for item in items_data]
    products = {p.id: p for p in Product.objects.filter(id__in=product_ids)}
    
    # Criar lista de itens
    items_to_create = []
    for item_data in items_data:
        product = products.get(item_data['product_id'])
        if not product:
            raise ValidationError(f"Produto com ID {item_data['product_id']} não encontrado")
        
        item_kwargs = {
            parent_field: parent_instance,
            'product': product,
            'quantity': item_data['quantity']
        }
        items_to_create.append(item_model(**item_kwargs))
    
    # Criar todos os itens de uma vez (bulk_create)
    return item_model.objects.bulk_create(items_to_create)


def create_entity_with_items(entity_model, item_model, parent_field, user, items_data, **kwargs):
    """
    Função genérica para criar entidades com itens.
    Substitui o Template Method Pattern complexo por uma função simples.
    
    Args:
        entity_model: Model da entidade (Sale ou Purchase)
        item_model: Model do item (SaleItem ou PurchaseItem)
        parent_field: Nome do campo pai ('sale' ou 'purchase')
        user: Usuário criador
        items_data: Lista de dados dos itens
        **kwargs: Argumentos adicionais para a entidade
    
    Returns:
        Instância da entidade criada
    """
    with transaction.atomic():
        # Criar entidade pai
        entity = entity_model.objects.create(user=user, **kwargs)
        
        # Criar itens
        create_items_bulk(items_data, item_model, parent_field, entity)
        
        return entity

