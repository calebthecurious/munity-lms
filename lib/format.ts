export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-AU", { // Use "en-AU" for Australian Dollars
    style: "currency",
    currency: "AUD" // Set currency to AUD
  }).format(price);
};