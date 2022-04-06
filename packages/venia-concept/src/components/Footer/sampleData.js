export const accountLinks = new Map()
    .set('Account', null)
    .set('Sign In', "/sign-in")
    .set('Register', "/create-account")
    .set('Order Status', null)
    .set('Returns', null);

export const aboutLinks = new Map()
    .set('About Us', null)
    .set('Our Story', null)
    .set('Email Signup', null)
    .set('Give Back', null);

// export const helpLinks = new Map()
//     .set('Help', null)
//     .set('Live Chat', null)
//     .set('Contact Us', null)
//     .set('Order Status', null)
//     .set('Returns', null);

export const DEFAULT_LINKS = new Map()
    .set('account', accountLinks)
    .set('about', aboutLinks);
    // .set('help', helpLinks);

//CUSTOM DATA

export const sedeOperaciones = {
    title: "Company title",
    address1: "Address1",
    address2: "Address2",
    country:"Country",
    tel: "Phone"
};

export const sedeFinanciera = {
    title: "Company title",
    address1: "Address1",
    address2: "Address2",
    country:"Country",
    tel: "Phone"
};

export const PHONE =
    'Phone';

export const MAIL =
    'mail@mail.com';