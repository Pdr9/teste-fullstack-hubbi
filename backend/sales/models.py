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
        """Calcula o status de compras da venda."""
        if not self.items.exists():
            return {
                'is_fully_purchased': True,
                'purchase_progress': 100.0,
                'total_items': 0,
                'purchased_items': 0
            }
        
        total_items = sum(item.quantity for item in self.items.all())
        purchased_items = 0
        
        # Calcular quantidade comprada para cada produto
        for sale_item in self.items.all():
            purchased_qty = sum(
                purchase_item.quantity 
                for purchase in self.purchases.all()
                for purchase_item in purchase.items.filter(product=sale_item.product)
            )
            purchased_items += purchased_qty
        
        purchase_progress = (purchased_items / total_items * 100) if total_items > 0 else 100.0
        is_fully_purchased = purchased_items >= total_items
        
        return {
            'is_fully_purchased': is_fully_purchased,
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
