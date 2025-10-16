// Configuration de l'API
const API_URL = 'http://localhost:3000/api';

// Variables globales
let products = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier l'authentification
    checkAuth();

    // Charger les produits
    loadProducts();

    // Initialiser les événements
    initializeEvents();
});

// Vérifier l'authentification
function checkAuth() {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!token || !currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Afficher le nom de l'utilisateur
    document.getElementById('userName').textContent = currentUser.fullname;
}

// Obtenir le token d'authentification
function getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Initialiser les événements
function initializeEvents() {
    const productForm = document.getElementById('productForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const searchInput = document.getElementById('searchInput');
    const filterCategory = document.getElementById('filterCategory');
    const cancelBtn = document.getElementById('cancelBtn');

    productForm.addEventListener('submit', handleSubmit);
    logoutBtn.addEventListener('click', handleLogout);
    searchInput.addEventListener('input', handleSearch);
    filterCategory.addEventListener('change', handleFilter);
    cancelBtn.addEventListener('click', cancelEdit);
}

// Charger les produits depuis l'API
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Token invalide, rediriger vers login
                localStorage.clear();
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Erreur lors du chargement des produits');
        }

        products = await response.json();
        renderProducts();
        updateStatistics();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des produits', 'error');
    }
}

// Gérer la soumission du formulaire (CREATE & UPDATE)
async function handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const description = document.getElementById('productDescription').value.trim();

    const productData = { name, category, price, quantity, description };

    try {
        let response;

        if (editingId) {
            // UPDATE
            response = await fetch(`${API_URL}/products/${editingId}`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(productData)
            });
            showToast('Produit modifié avec succès', 'success');
        } else {
            // CREATE
            response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(productData)
            });
            showToast('Produit ajouté avec succès', 'success');
        }

        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde');
        }

        editingId = null;
        resetForm();
        await loadProducts(); // Recharger les produits

    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la sauvegarde du produit', 'error');
    }
}

// Éditer un produit
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingId = id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productQuantity').value = product.quantity;
    document.getElementById('productDescription').value = product.description || '';

    document.getElementById('formTitle').textContent = 'Modifier le Produit';
    document.getElementById('submitBtn').innerHTML = '<span>💾</span> Mettre à jour';
    document.getElementById('cancelBtn').style.display = 'block';

    // Scroll vers le formulaire
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

// Supprimer un produit (DELETE)
async function deleteProduct(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
        }

        showToast('Produit supprimé avec succès', 'success');
        await loadProducts(); // Recharger les produits

    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression du produit', 'error');
    }
}

// Annuler l'édition
function cancelEdit() {
    editingId = null;
    resetForm();
}

// Réinitialiser le formulaire
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('formTitle').textContent = 'Ajouter un Produit';
    document.getElementById('submitBtn').innerHTML = '<span>➕</span> Ajouter';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Afficher les produits (READ)
function renderProducts(filteredProducts = null) {
    const productsBody = document.getElementById('productsBody');
    const displayProducts = filteredProducts || products;

    if (displayProducts.length === 0) {
        productsBody.innerHTML = `
            <tr class="empty-state">
                <td colspan="7">
                    <div class="empty-message">
                        <span class="empty-icon">📦</span>
                        <p>Aucun produit dans le stock</p>
                        <small>Commencez par ajouter votre premier produit</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    productsBody.innerHTML = displayProducts.map(product => {
        const totalValue = (parseFloat(product.price) * parseInt(product.quantity)).toFixed(2);
        const status = product.quantity < 10 ? 'low-stock' : 'in-stock';
        const statusText = product.quantity < 10 ? 'Stock Faible' : 'En Stock';

        return `
            <tr>
                <td><strong>${product.name}</strong></td>
                <td>${product.category}</td>
                <td>${parseFloat(product.price).toFixed(2)} €</td>
                <td>${product.quantity}</td>
                <td><strong>${totalValue} €</strong></td>
                <td><span class="status-badge status-${status}">${statusText}</span></td>
                <td>
                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})">✏️ Modifier</button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">🗑️ Supprimer</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Mettre à jour les statistiques
async function updateStatistics() {
    try {
        const response = await fetch(`${API_URL}/statistics`, {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des statistiques');
        }

        const stats = await response.json();

        document.getElementById('totalProducts').textContent = stats.total_products || 0;
        document.getElementById('totalValue').textContent = `${parseFloat(stats.total_value || 0).toFixed(2)} €`;
        document.getElementById('lowStock').textContent = stats.low_stock || 0;
        document.getElementById('inStock').textContent = stats.in_stock || 0;
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Rechercher des produits
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
    );
    renderProducts(filtered);
}

// Filtrer par catégorie
function handleFilter(e) {
    const category = e.target.value;
    if (!category) {
        renderProducts();
        return;
    }
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
}

// Déconnexion
function handleLogout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.clear();
        showToast('Déconnexion réussie', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Afficher une notification toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

