import React from "react";

export type AnyRecord = Record<string | number, any>;
export type Assign<T1 = {}, T2 = {}> = Omit<T1, keyof T2> & T2;

export interface UIComponent<
  T extends keyof JSX.IntrinsicElements | React.ComponentType,
  P extends object = {}
> extends React.ForwardRefExoticComponent<
    Assign<Omit<AnyRecord, "as">, Assign<React.ComponentPropsWithRef<T>, P>>
  > {
  <As extends keyof JSX.IntrinsicElements | React.ComponentType = T>(
    props: Assign<
      Omit<AnyRecord, "as">,
      Assign<React.ComponentPropsWithRef<As>, P> & {
        as?: As;
      }
    >
  ): React.ReactElement | null;
}
