from django.db import models
from django.contrib.auth.models import User
from products.models import Product
from core.mixins import SubtotalMixin


class Sale(models.Model):
    """
    Modelo que representa uma venda no sistema.
    
    Uma venda é criada por um usuário em uma data específica.
    Uma venda pode ter múltiplos produtos através do modelo SaleItem.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text="Usuário que criou a venda")
    date = models.DateTimeField(auto_now_add=True, help_text="Data e hora da criação da venda")

    class Meta:
        verbose_name = "Venda"
        verbose_name_plural = "Vendas"
        ordering = ['-date']

    def __str__(self):
        return f"Venda #{self.id} - {self.user.username}"
    
    @property
    def total_value(self):
        """Calcula o valor total da venda"""
        return sum(item.subtotal for item in self.items.all())
    
    @property
    def total_items(self):
        """Retorna o total de itens na venda"""
        return sum(item.quantity for item in self.items.all())
    
    def get_purchase_status(self):
        """
        Calcula o status detalhado de compras da venda.
        Única fonte de verdade para informações de compras.
        """
        if not self.items.exists():
            return {
                'is_fully_purchased': True,
                'missing_items': [],
                'purchase_progress': 100.0,
                'total_items': 0,
                'purchased_items': 0
            }
        
        total_items = 0
        purchased_items = 0
        missing_items = []
        is_fully_purchased = True
        
        for sale_item in self.items.all():
            total_items += sale_item.quantity
            
            # Calcular quantidade comprada para este produto
            purchased_qty = 0
            for purchase in self.purchases.all():
                for purchase_item in purchase.items.filter(product=sale_item.product):
                    purchased_qty += purchase_item.quantity
            
            purchased_items += purchased_qty
            
            if purchased_qty < sale_item.quantity:
                is_fully_purchased = False
                missing_items.append({
                    'product_id': sale_item.product.id,
                    'product_name': sale_item.product.name,
                    'required_quantity': sale_item.quantity,
                    'purchased_quantity': purchased_qty,
                    'missing_quantity': sale_item.quantity - purchased_qty
                })
        
        purchase_progress = (purchased_items / total_items * 100) if total_items > 0 else 100.0
        
        return {
            'is_fully_purchased': is_fully_purchased,
            'missing_items': missing_items,
            'purchase_progress': purchase_progress,
            'total_items': total_items,
            'purchased_items': purchased_items
        }


class SaleItem(SubtotalMixin, models.Model):
    """
    Modelo que representa um item específico dentro de uma venda.
    
    Cada SaleItem conecta uma venda a um produto específico com uma quantidade.
    Uma venda pode ter múltiplos SaleItems (múltiplos produtos).
    """
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items', help_text="Venda à qual este item pertence")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, help_text="Produto sendo vendido")
    quantity = models.PositiveIntegerField(help_text="Quantidade do produto vendida")

    class Meta:
        verbose_name = "Item da Venda"
        verbose_name_plural = "Itens das Vendas"
        unique_together = ['sale', 'product']

    def __str__(self):
        return f"{self.product.name} - Qtd: {self.quantity}"
