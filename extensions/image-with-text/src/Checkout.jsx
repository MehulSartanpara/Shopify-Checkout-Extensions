import {
  Image,
  InlineLayout,
  TextBlock,
  View,
  reactExtension,
  useSettings
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const {image_one, title_one, image_two, title_two, image_three, title_three, title_color} = useSettings();
  return (
    <InlineLayout columns={['33.33%', '33.33%', '33.33%']}>
      <View padding={["none","tight", "none", "tight"]} inlineAlignment={"center"}>
        <InlineLayout padding={["base", "none"]} columns={[90]}>
          <Image aspectRatio=" 1 / 1" source={`${image_one ? image_one : "https://cdn.shopify.com/s/files/1/0255/3249/8001/t/119/assets/New-Free-Shipping-with-Every-Order.png?v=140641777467727778021677214252"}`} fit="contain"/>
        </InlineLayout>
        <TextBlock inlineAlignment="center" appearance={`${title_color ? title_color : "accent"}`} size="base">{title_one ? title_one : 'Free Shipping with Every Order'}</TextBlock>
      </View>
      <View padding={["none","tight", "none", "tight"]} inlineAlignment={"center"}>
        <InlineLayout padding={["base", "none"]} columns={[90]}>
        <Image aspectRatio=" 1 / 1" source={`${image_two ? image_two : "https://cdn.shopify.com/s/files/1/0255/3249/8001/t/119/assets/Delivered-Fresh-Monthly.png?v=170065621086856978431677136042"}`} fit="contain"/>
        </InlineLayout>
        <TextBlock inlineAlignment="center" appearance={`${title_color ? title_color : "accent"}`} size="base">{title_two ? title_two : 'Delivered Fresh Monthly'}</TextBlock>
      </View>
      <View padding={["none","tight", "none", "tight"]} inlineAlignment={"center"}>
        <InlineLayout padding={["base", "none"]} columns={[90]}>
          <Image aspectRatio=" 1 / 1" source={`${image_three ? image_three : "https://cdn.shopify.com/s/files/1/0255/3249/8001/t/119/assets/New-Manufactured-in-the-USA.png?v=122724203750252202591677214272"}`} fit="contain"/>
        </InlineLayout>
        <TextBlock inlineAlignment="center" appearance={`${title_color ? title_color : "accent"}`} size="base">{title_three ? title_three : 'Manufactured in the USA'}</TextBlock>
      </View>
    </InlineLayout>
  );
}