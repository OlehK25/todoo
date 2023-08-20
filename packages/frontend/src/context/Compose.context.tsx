import React, { FC, ReactNode } from 'react';

export interface IComposeContext {
  components?: FC<{ children?: ReactNode }>[];
  children?: ReactNode | undefined;
}

export default function ComposeContext(
  props: IComposeContext,
) {
  const { components = [], children } = props;

  return (
    <>
      {components.reduceRight(
        (acc, Comp) => (
          <Comp>{acc}</Comp>
        ),
        children,
      )}
    </>
  );
}
