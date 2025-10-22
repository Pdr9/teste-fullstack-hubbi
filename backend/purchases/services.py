"""
Serviços para compras - implementação simplificada.
"""
from typing import List, Dict
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import Purchase, PurchaseItem
from sales.models import Sale
from core.services import create_entity_with_items


def validate_purchase_business_rules(sale_id: int, items_data: List[Dict]):
    """
    Valida regras de negócio específicas para compras.
    """
    if not sale_id:
        raise ValidationError("Sale ID é obrigatório para compras")
    
    # Validar produtos estão na venda
    try:
        sale = Sale.objects.get(id=sale_id)
        product_ids = [item['product_id'] for item in items_data]
        sale_product_ids = set(sale.items.values_list('product_id', flat=True))
        
        if not set(product_ids).issubset(sale_product_ids):
            raise ValidationError("Compra deve conter apenas produtos da venda relacionada")
    except Sale.DoesNotExist:
        raise ValidationError("Venda não encontrada")


def create_purchase_with_items(user: User, items_data: List[Dict], sale_id: int) -> Purchase:
    """
    Cria uma compra com itens de forma simples e direta.
    """
    # Validar regras de negócio
    validate_purchase_business_rules(sale_id, items_data)
    
    # Criar compra
    return create_entity_with_items(
        entity_model=Purchase,
        item_model=PurchaseItem,
        parent_field='purchase',
        user=user,
        items_data=items_data,
        sale_id=sale_id
    )
