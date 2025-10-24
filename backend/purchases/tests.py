from django.test import TestCase
from django.contrib.auth.models import User
from decimal import Decimal
from products.models import Product
from sales.models import Sale
from purchases.models import Purchase, PurchaseItem


class PurchaseModelTest(TestCase):
    """Testes para os modelos Purchase e PurchaseItem."""
    
    def setUp(self):
        """Configuração inicial para os testes."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.product1 = Product.objects.create(
            name='Produto 1',
            price=Decimal('10.00'),
            user=self.user
        )
        
        self.product2 = Product.objects.create(
            name='Produto 2',
            price=Decimal('20.00'),
            user=self.user
        )
        
        self.sale = Sale.objects.create(
            user=self.user
        )
    
    def test_create_purchase(self):
        """Testa criação básica de compra."""
        purchase = Purchase.objects.create(
            sale=self.sale,
            user=self.user
        )
        
        self.assertEqual(purchase.sale, self.sale)
        self.assertEqual(purchase.user, self.user)
        self.assertEqual(purchase.total_items, 0)
        self.assertEqual(purchase.total_value, Decimal('0.00'))
    
    def test_purchase_with_items(self):
        """Testa compra com itens e cálculos automáticos."""
        purchase = Purchase.objects.create(
            sale=self.sale,
            user=self.user
        )
        
        # Adicionar itens
        PurchaseItem.objects.create(
            purchase=purchase,
            product=self.product1,
            quantity=3
        )
        
        PurchaseItem.objects.create(
            purchase=purchase,
            product=self.product2,
            quantity=2
        )
        
        # Verificar cálculos
        expected_total_items = 5
        expected_total_value = Decimal('70.00')  # (3 * 10) + (2 * 20)
        
        self.assertEqual(purchase.total_items, expected_total_items)
        self.assertEqual(purchase.total_value, expected_total_value)
    
    def test_purchase_str_representation(self):
        """Testa representação string da compra."""
        purchase = Purchase.objects.create(
            sale=self.sale,
            user=self.user
        )
        
        expected = f"Compra #{purchase.id} - {self.user.username}"
        self.assertEqual(str(purchase), expected)
    
    def test_purchase_item_str_representation(self):
        """Testa representação string do item de compra."""
        purchase = Purchase.objects.create(
            sale=self.sale,
            user=self.user
        )
        
        item = PurchaseItem.objects.create(
            purchase=purchase,
            product=self.product1,
            quantity=4
        )
        
        expected = "Produto 1 - Qtd: 4"
        self.assertEqual(str(item), expected)
    
    def test_purchase_item_subtotal_calculation(self):
        """Testa cálculo de subtotal do item."""
        purchase = Purchase.objects.create(
            sale=self.sale,
            user=self.user
        )
        
        item = PurchaseItem.objects.create(
            purchase=purchase,
            product=self.product2,
            quantity=3
        )
        
        expected_subtotal = Decimal('60.00')  # 3 * 20.00
        self.assertEqual(item.subtotal, expected_subtotal)