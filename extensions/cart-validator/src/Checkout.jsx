import {
  Banner,
  Text,
  reactExtension,
  useBuyerJourneyIntercept,
  useCartLines,
  useSettings,
  useTotalAmount
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const [showBanner, setshowBanner] = useState(false);
  const {banner_status, validation_amount, banner_title} = useSettings();
  const totalAmount = useTotalAmount();
  const cart = useCartLines();
  let settings_validation_amount = validation_amount;
  if(!validation_amount){
    settings_validation_amount = 11;
  }

  useEffect(() => {
    if(totalAmount?.amount >= settings_validation_amount){
      if(showBanner == true){
        setshowBanner(false);
      }
    }
  }, [totalAmount])
  

  if(cart?.length == 1 && (cart?.[0]?.merchandise?.product?.productType == 'Gift Card' || !cart?.[0]?.merchandise?.requiresShipping)){
    console.log("Gift Product")
  }else{
    useBuyerJourneyIntercept(
      ({canBlockProgress}) => {
        if(canBlockProgress && totalAmount?.amount < settings_validation_amount){
          return {
            behavior: 'block',
            reason: 'Invalid shipping country',
            perform: (result) => {
              // If progress can be blocked, then set a validation error on the custom field
              if (result?.behavior == 'block') {
                setshowBanner(true)
              }
            },
          }
        }else{
          return {
            behavior: 'allow',
            perform: (result) => {
              // If progress can be blocked, then set a validation error on the custom field
              if (result.behavior === "allow") {
                setshowBanner(false)
              }
            },
          }
        }
      },
    );
  }

  return (
    <>
      {
        showBanner ? 
        <Banner status={`${banner_status ? banner_status : 'critical'}`}>
          <Text size="large">{banner_title ? banner_title : 'Minimum purchase amount is not achieved. Please update your cart contents and try again.'}</Text>
        </Banner>
        : ''
      }
    </>
  );
}

