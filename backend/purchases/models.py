from django.db import models
from django.contrib.auth.models import User
from products.models import Product
from sales.models import Sale
from core.mixins import SubtotalMixin


class Purchase(models.Model):
    """
    Modelo que representa uma compra no sistema.
    
    Uma compra é criada para atender uma venda específica.
    Uma compra pode ter múltiplos produtos através do modelo PurchaseItem.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text="Usuário que criou a compra")
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='purchases', help_text="Venda que esta compra está atendendo")
    date = models.DateTimeField(auto_now_add=True, help_text="Data e hora da criação da compra")

    class Meta:
        verbose_name = "Compra"
        verbose_name_plural = "Compras"
        ordering = ['-date']

    def __str__(self):
        return f"Compra #{self.id} - {self.user.username}"


class PurchaseItem(SubtotalMixin, models.Model):
    """
    Modelo que representa um item específico dentro de uma compra.
    
    Cada PurchaseItem conecta uma compra a um produto específico com uma quantidade.
    Uma compra pode ter múltiplos PurchaseItems (múltiplos produtos).
    """
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE, related_name='items', help_text="Compra à qual este item pertence")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, help_text="Produto sendo comprado")
    quantity = models.PositiveIntegerField(help_text="Quantidade do produto comprada")

    class Meta:
        verbose_name = "Item da Compra"
        verbose_name_plural = "Itens das Compras"
        unique_together = ['purchase', 'product']

    def __str__(self):
        return f"{self.product.name} - Qtd: {self.quantity}"
