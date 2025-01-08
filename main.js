document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-form');
    const cartTable = document.getElementById('cart-Table');
    const addFavButton = document.getElementById('AddFav');
    const applyFavButton = document.getElementById('ApplyFav');
    const checkoutButton = document.getElementById('checkout-button');
    const summaryTable = document.getElementById('summaryTable');
    const totalCostElement = document.getElementById('totalCost');
    const checkoutForm = document.getElementById('checkout-form');

    // Define the cost object with item prices
    const cost = {
        Analgesics: {
            Aspirin: 130,
            Paracetamol: 100,
            Ibuprofen: 160,
            Methadone: 340,
            Oxycodone: 150,
            Hydromorphone: 170 
        },
        Antibiotics: {
            Azithromycin: 180,
            Benzylpenicillin: 100,
            Cephalexin: 200,
            Nafcillin: 210,
            Penicillin: 120,
            Tetracycline: 170
        },
        Antidepressants: {
            Citalopram: 230,
            Dapoxetine: 420,
            Escitalopram: 120,
            Paroxetine: 380,
            Sertraline: 320,
            Fluoxetine: 280
        },
        Antihypertensives: {
            Amlodipine: 160,
            Atenolol: 220,
            Clonidine: 260,
            Lisinopril: 280,
            Losartan: 430,
            Enalapril: 320
        },
        Antihistamines: {
            Benadryl: 300,
            Brompheniramine: 250,
            Cetirizine: 340,
            Chlorpheniramine: 290,
            Clemastine: 130,
            Desloratadine: 360
        }
    };

    let orderData = {};
    let totalCost = 0;

    // Handle order page form submission
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(form);
            orderData = {};
            totalCost = 0;

            for (let [key, value] of formData.entries()) {
                if (value && value !== '0') {
                    const [category, item] = key.split(/\[|\]/).filter(Boolean);
                    if (!orderData[category]) {
                        orderData[category] = {};
                    }
                    orderData[category][item] = value;
                }
            }

            updateTable();
        });

        addFavButton.addEventListener('click', () => {
            localStorage.setItem("favourite", JSON.stringify(orderData));
            alert("Your favorite order has been saved.");
        });

        applyFavButton.addEventListener('click', () => {
            const favourite = JSON.parse(localStorage.getItem("favourite"));
            if (favourite) {
                orderData = favourite;
                populateForm();
                updateTable();
                alert("Favorite order applied.");
            } else {
                alert("No favorite order found.");
            }
        });

        checkoutButton.addEventListener('click', () => {
            localStorage.setItem("currentOrder", JSON.stringify(orderData));
            localStorage.setItem("totalCost", totalCost.toFixed(2));
            window.location.href = "checkout.html"; // Navigate to checkout page
        });

        function updateTable() {
            while (cartTable.rows.length > 1) {
                cartTable.deleteRow(1);
            }

            for (const category in orderData) {
                for (const item in orderData[category]) {
                    const quantity = orderData[category][item];
                    const price = cost[category][item] * quantity;
                    totalCost += price;

                    const row = cartTable.insertRow();
                    row.insertCell().textContent = item;
                    row.insertCell().textContent = quantity;
                    row.insertCell().textContent = `LKR ${price.toFixed(2)}`;
                }
            }

            const totalRow = cartTable.insertRow();
            totalRow.insertCell().textContent = 'Total';
            totalRow.insertCell().rowSpan = 2;
            totalRow.insertCell().textContent = `LKR ${totalCost.toFixed(2)}`;
        }

        function populateForm() {
            for (const category in orderData) {
                for (const item in orderData[category]) {
                    const input = document.querySelector(`input[name="${category}[${item}]"]`);
                    if (input) {
                        input.value = orderData[category][item];
                    }
                }
            }
        }
    }

    // Handle checkout page display and form submission
    if (summaryTable && totalCostElement && checkoutForm) {
        const orderData = JSON.parse(localStorage.getItem('currentOrder'));
        const totalCost = localStorage.getItem('totalCost');

        for (const category in orderData) {
            for (const item in orderData[category]) {
                const quantity = orderData[category][item];
                const row = summaryTable.insertRow();
                row.insertCell().textContent = item;
                row.insertCell().textContent = quantity;
                row.insertCell().textContent = `LKR ${cost[category][item] * quantity}`;
            }
        }

        totalCostElement.textContent = `Total: LKR ${totalCost}`;

        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert(`Thank you for your purchase! Your order will be delivered on 31st January 2025.`);
            localStorage.removeItem('currentOrder');
            localStorage.removeItem('totalCost');
            window.location.href = 'order.html'; 
        });
    }


});
