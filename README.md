<div align="center">
    <img src="./app/packages/extensions/images/B2BStoreLogo.svg" width="" height="90">
</div>

</br>

# B2B Store, the fork of [PWA Studio](https://github.com/magento/pwa-studio)

#### Table of Contents

- [📢 What is B2BStore?](#-what-is-b2b-store)
- [⭐ B2B Store features](#-b2b-store-features)
- [🛒 Supported Platforms](#-supported-platforms)
- [✅ Requirements](#-requirements)
- [⚙️ Installation](#%EF%B8%8F-installation)
- [🙌🏼 How to contribute](#-how-to-contribute)

</br>

## 📢 What is B2B Store?

The B2B Frontend as a Service (FEaaS) solution for your e-Commerce... Boost your B2B customer journey and performances using a modern, high featured, open source ecommerce platform based on leaders solutions like Magento Open Source and PWA Studio (React frontend).

With our customized solution we make it possible for manufacturers to add value to their distribution chain. Our value proposition is based on a platform with the functionalities of a B2B, adapted to your needs, and that will allow you to go to market in record time.


🚀 Feel free to use our demo: <a href="https://demo.b2bstore.io/" target="_blank">https://demo.b2bstore.io/</a> 🚀
- ✉️ Login: test@orienteed.com
- 🔑 Password: TstAcc2022

</br>

## ⭐ B2B Store features

Quick recap of the main features natively offered by B2BStore and strongly suggested for any B2B channel

- Access by Login / credentials
- Quote (Offers) and Request for Quote
- Multiple Saved Carts
- One click re-order
- Order incidence (CSR)
- Quick cart with CSV cart import
- Cart edit adding header/image & updating prices with PDF print option
- Product and List pages specialised for B2B 
- Sales agents organization & access to the dashboard of their customers
- Assignment of a customer to a specific agent
- Buy on behalf
- Checkout personalizations adapted for external platforms (ERP)
- Use of external client number (CRM)
- Advanced pricing based on lists
- Search and add to cart from autosuggestions
- Mega Menu

</br>

## 🛒 Supported Platforms

<table>
  <tr>
    <td align="center"><a href="https://business.adobe.com/products/magento/magento-commerce.html"><img src="./app/packages/extensions/images/MagentoLogo.svg" width="60" height="60" alt=""/><br /><sub><b>Magento</b></sub></a><br /></td>
    <td align="center"><a href="https://www.orienteed.com/en/blog"><img src="./app/packages/extensions/images/ComingSoon.png" width="60" height="60" alt=""/><br /><sub><b>Stay tuned!</b></sub></a><br /></td>
  </tr>
</table>

</br>

## ✅ Requirements

The only requirements are to have installed Docker and docker-compose. If you don't have them installed, you can follow the <a href="https://docs.docker.com/engine/install/" target="_blank">Docker installation guide</a> and the <a href="https://docs.docker.com/compose/install/" target="_blank">Docker Compose installation guide</a>.

</br>

## ⚙️ Installation

To install B2B Store you need to follow these steps:

1. Clone the repository with:

```
git clone https://github.com/orienteed/b2bstore.git
```

2. Copy the _.env.example_ file to _.env_.
3. Fill _.env_ file with the required data.
4. Run the following command to start the gateway:

```
docker-compose up -d
```

5. Execute the following command to enter the container:

```
docker exec -it b2bstore-pwa-1 bash
```

6. Inside the container, execute the following command to install the dependencies and start B2B Store (development mode):

```
cd app; yarn; yarn watch:all
```

7. Now your B2B Store is running, you can see it in the following URL: <a href="http://localhost:10000" target="_blank">http://localhost:10000</a>

</br>

## 🙌🏼 How to contribute

To contribute to this project, you can do it in the following ways:

- Reporting bugs.
- Suggesting enhancements.
- Opening pull requests.

If you want to know more, please <a href="https://www.b2bstore.io/contact" target="_blank">contact us</a>

<hr>

<div align="center">
    <h3>Developed by</h3>
    <a href="https://www.orienteed.com/" target="_blank"><img src="./app/packages/extensions/images/OrienteedLogo.svg" width="" height="90" align = "middle"></a>
</div>
