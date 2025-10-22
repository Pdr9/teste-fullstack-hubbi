"""
Serviços para vendas - implementação simplificada.
"""
from typing import List, Dict
from django.contrib.auth.models import User
from .models import Sale, SaleItem
from core.services import create_entity_with_items


def create_sale_with_items(user: User, items_data: List[Dict]) -> Sale:
    """
    Cria uma venda com itens de forma simples e direta.
    """
    return create_entity_with_items(
        entity_model=Sale,
        item_model=SaleItem,
        parent_field='sale',
        user=user,
        items_data=items_data
    )
