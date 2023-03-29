---
head:
  - - meta
    - property: og:title
      content: HouseForm React Native Usage
  - - meta
    - property: og:description
      content: Learn how to use HouseForm with React Native.
---

# Usage with React Native

Because HouseForm is headless, it supports React Native without any further customizations. Here's an example of a simple React Native form using HouseForm:

```tsx
import { Field, Form } from "houseform";
import { z } from "zod";
import { Alert, Button, Text, TextInput, View } from "react-native";

export default function App() {
  return (
    <Form
      onSubmit={(values) => {
        Alert.alert("Form was submitted with: " + JSON.stringify(values));
      }}
    >
      {({ isValid, submit }) => (
        <View>
          <Field
            name="email"
            onBlurValidate={z.string().email("This must be an email")}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <View>
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => setValue(text)}
                    placeholder={"Email"}
                  />
                  {errors.map((error) => (
                    <Text key={error}>{error}</Text>
                  ))}
                </View>
              );
            }}
          </Field>
          <Button disabled={!isValid} title="Submit" />
        </View>
      )}
    </Form>
  );
}
```
