import {
  Banner,
  Button,
  Heading,
  InlineSpacer,
  InlineStack,
  Link,
  Modal,
  Text,
  reactExtension,
  useApi,
  useBuyerJourneyIntercept,
  useCartLines,
  useSettings,
  useShippingAddress
} from '@shopify/ui-extensions-react/checkout';
import { useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const {ui} = useApi();
  const data = useShippingAddress();
  const {banner_title, click_title, confirmbox_title, edit_btn_label, confirm_btn_label} = useSettings();
  const [enableCheckout, setenableCheckout] = useState(false);
  const [showBanner, setshowBanner] = useState(false);
  const cart = useCartLines();
  
  let addressObj = {
    address1 : data?.address1,
    city: data?.city,
    countryCode: data?.countryCode,
    lastName: data?.lastName,
    provinceCode: data?.provinceCode,
    zip: data?.zip
  }

  function checkValidValues(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value === undefined || value === '') {
          return false; // Return false if any key has value undefined or blank
        }
      }
    }
    return true; // Return true if all keys have non-blank values
  }
  const isAddressValid = checkValidValues(addressObj)

  if(cart?.length == 1 && (cart?.[0]?.merchandise?.product?.productType == 'Gift Card' || !cart?.[0]?.merchandise?.requiresShipping)){
    console.log("Gift Product")
  }else{
    useBuyerJourneyIntercept(
      ({canBlockProgress}) => {
        if(canBlockProgress && !enableCheckout){
          return {
            behavior: 'block',
            reason: 'Invalid shipping country',
            perform: (result) => {
              // If progress can be blocked, then set a validation error on the custom field
              if (result?.behavior == 'block') {
                setshowBanner(true)
                setenableCheckout(false)
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
                setenableCheckout(true)
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
        showBanner && isAddressValid ? 
        <>
          <Banner status="warning">
            <Text size='medium'>{banner_title ? banner_title : 'Please confirm your address'} &nbsp;</Text>
            <Link
              overlay={
                <Modal
                  id="my-modal"
                  padding
                  title={confirmbox_title ? confirmbox_title : "Is the Shipping Address Correct ?"}
                >
                  <InlineStack spacing="none" padding={['none', 'none', 'base', 'none']}>
                    <Heading level="3">First Name : </Heading>
                    <InlineSpacer spacing="base" />
                    <Text>{data?.firstName ? data?.firstName : '--'}</Text>
                  </InlineStack>

                  <InlineStack spacing="none" padding={['none', 'none', 'base', 'none']}>
                    <Heading level="3">Last Name : </Heading>
                    <InlineSpacer spacing="base" />
                    <Text>{data?.lastName ? data?.lastName : '--'}</Text>
                  </InlineStack>

                  <InlineStack spacing="none" padding={['none', 'none', 'base', 'none']}>
                    <Heading level="3">Address1 : </Heading>
                    <InlineSpacer spacing="base" />
                    <Text>{data?.address1 ? data?.address1 : '--'}</Text>
                  </InlineStack>

                  <InlineStack spacing="none" padding={['none', 'none', 'base', 'none']}>
                    <Heading level="3">Address2 : </Heading>
                    <InlineSpacer spacing="base" />
                    <Text>{data?.address2 ? data?.address2 : '--'}</Text>
                  </InlineStack>

                  <InlineStack spacing="none" padding={['none', 'none', 'base', 'none']}>
                    <Heading level="3">City : </Heading>
                    <InlineSpacer spacing="base" />
                    <Text>{data?.city ? data?.city : '--'}</Text>
                  </InlineStack>

                  <InlineStack spacing="none" padding={['none', 'none', 'base', 'none']}>
                    <Heading level="3">State : </Heading>
                    <InlineSpacer spacing="base" />
                    <Text>{data?.provinceCode ? data?.provinceCode : '--'}</Text>
                  </InlineStack>

                  <InlineStack spacing="none" padding={['none', 'none', 'base', 'none']}>
                    <Heading level="3">Zip Code : </Heading>
                    <InlineSpacer spacing="base" />
                    <Text>{data?.zip ? data?.zip : '--'}</Text>
                  </InlineStack>

                  <InlineStack spacing="base">
                    <Button onPress={() => ui.overlay.close('my-modal') }>{edit_btn_label ? edit_btn_label : 'Update Address'}</Button>
                    <Button onPress={() =>
                        {
                          ui.overlay.close('my-modal');
                          setshowBanner(false)
                          setenableCheckout(true)
                        }
                      }
                    >
                      {confirm_btn_label ? confirm_btn_label : 'Proceed'}
                    </Button>
                  </InlineStack>
                </Modal>
              }
            >
              {click_title ? click_title : 'Click here'}
            </Link>
          </Banner>
        </>
        : null
      }
    </>
  );
}