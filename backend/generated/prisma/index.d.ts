
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Auth
 * 
 */
export type Auth = $Result.DefaultSelection<Prisma.$AuthPayload>
/**
 * Model StAccount
 * 
 */
export type StAccount = $Result.DefaultSelection<Prisma.$StAccountPayload>
/**
 * Model Specialization
 * 
 */
export type Specialization = $Result.DefaultSelection<Prisma.$SpecializationPayload>
/**
 * Model TAccount
 * 
 */
export type TAccount = $Result.DefaultSelection<Prisma.$TAccountPayload>
/**
 * Model PlanDesc
 * 
 */
export type PlanDesc = $Result.DefaultSelection<Prisma.$PlanDescPayload>
/**
 * Model PlanRecord
 * 
 */
export type PlanRecord = $Result.DefaultSelection<Prisma.$PlanRecordPayload>
/**
 * Model ClassRecord
 * 
 */
export type ClassRecord = $Result.DefaultSelection<Prisma.$ClassRecordPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Auths
 * const auths = await prisma.auth.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Auths
   * const auths = await prisma.auth.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.auth`: Exposes CRUD operations for the **Auth** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Auths
    * const auths = await prisma.auth.findMany()
    * ```
    */
  get auth(): Prisma.AuthDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stAccount`: Exposes CRUD operations for the **StAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StAccounts
    * const stAccounts = await prisma.stAccount.findMany()
    * ```
    */
  get stAccount(): Prisma.StAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.specialization`: Exposes CRUD operations for the **Specialization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Specializations
    * const specializations = await prisma.specialization.findMany()
    * ```
    */
  get specialization(): Prisma.SpecializationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tAccount`: Exposes CRUD operations for the **TAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TAccounts
    * const tAccounts = await prisma.tAccount.findMany()
    * ```
    */
  get tAccount(): Prisma.TAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.planDesc`: Exposes CRUD operations for the **PlanDesc** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlanDescs
    * const planDescs = await prisma.planDesc.findMany()
    * ```
    */
  get planDesc(): Prisma.PlanDescDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.planRecord`: Exposes CRUD operations for the **PlanRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlanRecords
    * const planRecords = await prisma.planRecord.findMany()
    * ```
    */
  get planRecord(): Prisma.PlanRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.classRecord`: Exposes CRUD operations for the **ClassRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClassRecords
    * const classRecords = await prisma.classRecord.findMany()
    * ```
    */
  get classRecord(): Prisma.ClassRecordDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.15.0
   * Query Engine version: 85179d7826409ee107a6ba334b5e305ae3fba9fb
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Auth: 'Auth',
    StAccount: 'StAccount',
    Specialization: 'Specialization',
    TAccount: 'TAccount',
    PlanDesc: 'PlanDesc',
    PlanRecord: 'PlanRecord',
    ClassRecord: 'ClassRecord'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "auth" | "stAccount" | "specialization" | "tAccount" | "planDesc" | "planRecord" | "classRecord"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Auth: {
        payload: Prisma.$AuthPayload<ExtArgs>
        fields: Prisma.AuthFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          findFirst: {
            args: Prisma.AuthFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          findMany: {
            args: Prisma.AuthFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>[]
          }
          create: {
            args: Prisma.AuthCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          createMany: {
            args: Prisma.AuthCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>[]
          }
          delete: {
            args: Prisma.AuthDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          update: {
            args: Prisma.AuthUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          deleteMany: {
            args: Prisma.AuthDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>[]
          }
          upsert: {
            args: Prisma.AuthUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          aggregate: {
            args: Prisma.AuthAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuth>
          }
          groupBy: {
            args: Prisma.AuthGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthCountArgs<ExtArgs>
            result: $Utils.Optional<AuthCountAggregateOutputType> | number
          }
        }
      }
      StAccount: {
        payload: Prisma.$StAccountPayload<ExtArgs>
        fields: Prisma.StAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StAccountPayload>
          }
          findFirst: {
            args: Prisma.StAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StAccountPayload>
          }
          findMany: {
            args: Prisma.StAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StAccountPayload>[]
          }
          create: {
            args: Prisma.StAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StAccountPayload>
          }
          createMany: {
            args: Prisma.StAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StAccountPayload>[]
          }
          delete: {
            args: Prisma.StAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StAccountPayload>
          }
          update: {
            args: Prisma.StAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StAccountPayload>
          }
          deleteMany: {
            args: Prisma.StAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StAccountPayload>[]
          }
          upsert: {
            args: Prisma.StAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StAccountPayload>
          }
          aggregate: {
            args: Prisma.StAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStAccount>
          }
          groupBy: {
            args: Prisma.StAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<StAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.StAccountCountArgs<ExtArgs>
            result: $Utils.Optional<StAccountCountAggregateOutputType> | number
          }
        }
      }
      Specialization: {
        payload: Prisma.$SpecializationPayload<ExtArgs>
        fields: Prisma.SpecializationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpecializationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpecializationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpecializationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpecializationPayload>
          }
          findFirst: {
            args: Prisma.SpecializationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpecializationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpecializationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpecializationPayload>
          }
          findMany: {
            args: Prisma.SpecializationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpecializationPayload>[]
          }
          create: {
            args: Prisma.SpecializationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpecializationPayload>
          }
          createMany: {
            args: Prisma.SpecializationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpecializationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpecializationPayload>[]
          }
          delete: {
            args: Prisma.SpecializationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpecializationPayload>
          }
          update: {
            args: Prisma.SpecializationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpecializationPayload>
          }
          deleteMany: {
            args: Prisma.SpecializationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpecializationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SpecializationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpecializationPayload>[]
          }
          upsert: {
            args: Prisma.SpecializationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpecializationPayload>
          }
          aggregate: {
            args: Prisma.SpecializationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpecialization>
          }
          groupBy: {
            args: Prisma.SpecializationGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpecializationGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpecializationCountArgs<ExtArgs>
            result: $Utils.Optional<SpecializationCountAggregateOutputType> | number
          }
        }
      }
      TAccount: {
        payload: Prisma.$TAccountPayload<ExtArgs>
        fields: Prisma.TAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TAccountPayload>
          }
          findFirst: {
            args: Prisma.TAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TAccountPayload>
          }
          findMany: {
            args: Prisma.TAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TAccountPayload>[]
          }
          create: {
            args: Prisma.TAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TAccountPayload>
          }
          createMany: {
            args: Prisma.TAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TAccountPayload>[]
          }
          delete: {
            args: Prisma.TAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TAccountPayload>
          }
          update: {
            args: Prisma.TAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TAccountPayload>
          }
          deleteMany: {
            args: Prisma.TAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TAccountPayload>[]
          }
          upsert: {
            args: Prisma.TAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TAccountPayload>
          }
          aggregate: {
            args: Prisma.TAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTAccount>
          }
          groupBy: {
            args: Prisma.TAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<TAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.TAccountCountArgs<ExtArgs>
            result: $Utils.Optional<TAccountCountAggregateOutputType> | number
          }
        }
      }
      PlanDesc: {
        payload: Prisma.$PlanDescPayload<ExtArgs>
        fields: Prisma.PlanDescFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlanDescFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanDescPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlanDescFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanDescPayload>
          }
          findFirst: {
            args: Prisma.PlanDescFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanDescPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlanDescFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanDescPayload>
          }
          findMany: {
            args: Prisma.PlanDescFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanDescPayload>[]
          }
          create: {
            args: Prisma.PlanDescCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanDescPayload>
          }
          createMany: {
            args: Prisma.PlanDescCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlanDescCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanDescPayload>[]
          }
          delete: {
            args: Prisma.PlanDescDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanDescPayload>
          }
          update: {
            args: Prisma.PlanDescUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanDescPayload>
          }
          deleteMany: {
            args: Prisma.PlanDescDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlanDescUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlanDescUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanDescPayload>[]
          }
          upsert: {
            args: Prisma.PlanDescUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanDescPayload>
          }
          aggregate: {
            args: Prisma.PlanDescAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlanDesc>
          }
          groupBy: {
            args: Prisma.PlanDescGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlanDescGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlanDescCountArgs<ExtArgs>
            result: $Utils.Optional<PlanDescCountAggregateOutputType> | number
          }
        }
      }
      PlanRecord: {
        payload: Prisma.$PlanRecordPayload<ExtArgs>
        fields: Prisma.PlanRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlanRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlanRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanRecordPayload>
          }
          findFirst: {
            args: Prisma.PlanRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlanRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanRecordPayload>
          }
          findMany: {
            args: Prisma.PlanRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanRecordPayload>[]
          }
          create: {
            args: Prisma.PlanRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanRecordPayload>
          }
          createMany: {
            args: Prisma.PlanRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlanRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanRecordPayload>[]
          }
          delete: {
            args: Prisma.PlanRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanRecordPayload>
          }
          update: {
            args: Prisma.PlanRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanRecordPayload>
          }
          deleteMany: {
            args: Prisma.PlanRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlanRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlanRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanRecordPayload>[]
          }
          upsert: {
            args: Prisma.PlanRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanRecordPayload>
          }
          aggregate: {
            args: Prisma.PlanRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlanRecord>
          }
          groupBy: {
            args: Prisma.PlanRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlanRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlanRecordCountArgs<ExtArgs>
            result: $Utils.Optional<PlanRecordCountAggregateOutputType> | number
          }
        }
      }
      ClassRecord: {
        payload: Prisma.$ClassRecordPayload<ExtArgs>
        fields: Prisma.ClassRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClassRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClassRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRecordPayload>
          }
          findFirst: {
            args: Prisma.ClassRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClassRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRecordPayload>
          }
          findMany: {
            args: Prisma.ClassRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRecordPayload>[]
          }
          create: {
            args: Prisma.ClassRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRecordPayload>
          }
          createMany: {
            args: Prisma.ClassRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClassRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRecordPayload>[]
          }
          delete: {
            args: Prisma.ClassRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRecordPayload>
          }
          update: {
            args: Prisma.ClassRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRecordPayload>
          }
          deleteMany: {
            args: Prisma.ClassRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClassRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClassRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRecordPayload>[]
          }
          upsert: {
            args: Prisma.ClassRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRecordPayload>
          }
          aggregate: {
            args: Prisma.ClassRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClassRecord>
          }
          groupBy: {
            args: Prisma.ClassRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClassRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClassRecordCountArgs<ExtArgs>
            result: $Utils.Optional<ClassRecordCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    auth?: AuthOmit
    stAccount?: StAccountOmit
    specialization?: SpecializationOmit
    tAccount?: TAccountOmit
    planDesc?: PlanDescOmit
    planRecord?: PlanRecordOmit
    classRecord?: ClassRecordOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type StAccountCountOutputType
   */

  export type StAccountCountOutputType = {
    plans: number
    classes: number
  }

  export type StAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plans?: boolean | StAccountCountOutputTypeCountPlansArgs
    classes?: boolean | StAccountCountOutputTypeCountClassesArgs
  }

  // Custom InputTypes
  /**
   * StAccountCountOutputType without action
   */
  export type StAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccountCountOutputType
     */
    select?: StAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StAccountCountOutputType without action
   */
  export type StAccountCountOutputTypeCountPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanRecordWhereInput
  }

  /**
   * StAccountCountOutputType without action
   */
  export type StAccountCountOutputTypeCountClassesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassRecordWhereInput
  }


  /**
   * Count Type SpecializationCountOutputType
   */

  export type SpecializationCountOutputType = {
    teachers: number
  }

  export type SpecializationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    teachers?: boolean | SpecializationCountOutputTypeCountTeachersArgs
  }

  // Custom InputTypes
  /**
   * SpecializationCountOutputType without action
   */
  export type SpecializationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpecializationCountOutputType
     */
    select?: SpecializationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SpecializationCountOutputType without action
   */
  export type SpecializationCountOutputTypeCountTeachersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TAccountWhereInput
  }


  /**
   * Count Type TAccountCountOutputType
   */

  export type TAccountCountOutputType = {
    specs: number
    classes: number
  }

  export type TAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    specs?: boolean | TAccountCountOutputTypeCountSpecsArgs
    classes?: boolean | TAccountCountOutputTypeCountClassesArgs
  }

  // Custom InputTypes
  /**
   * TAccountCountOutputType without action
   */
  export type TAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccountCountOutputType
     */
    select?: TAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TAccountCountOutputType without action
   */
  export type TAccountCountOutputTypeCountSpecsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpecializationWhereInput
  }

  /**
   * TAccountCountOutputType without action
   */
  export type TAccountCountOutputTypeCountClassesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassRecordWhereInput
  }


  /**
   * Count Type PlanDescCountOutputType
   */

  export type PlanDescCountOutputType = {
    records: number
  }

  export type PlanDescCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    records?: boolean | PlanDescCountOutputTypeCountRecordsArgs
  }

  // Custom InputTypes
  /**
   * PlanDescCountOutputType without action
   */
  export type PlanDescCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDescCountOutputType
     */
    select?: PlanDescCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlanDescCountOutputType without action
   */
  export type PlanDescCountOutputTypeCountRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanRecordWhereInput
  }


  /**
   * Count Type PlanRecordCountOutputType
   */

  export type PlanRecordCountOutputType = {
    classes: number
  }

  export type PlanRecordCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | PlanRecordCountOutputTypeCountClassesArgs
  }

  // Custom InputTypes
  /**
   * PlanRecordCountOutputType without action
   */
  export type PlanRecordCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecordCountOutputType
     */
    select?: PlanRecordCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlanRecordCountOutputType without action
   */
  export type PlanRecordCountOutputTypeCountClassesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassRecordWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Auth
   */

  export type AggregateAuth = {
    _count: AuthCountAggregateOutputType | null
    _avg: AuthAvgAggregateOutputType | null
    _sum: AuthSumAggregateOutputType | null
    _min: AuthMinAggregateOutputType | null
    _max: AuthMaxAggregateOutputType | null
  }

  export type AuthAvgAggregateOutputType = {
    auth_id: number | null
  }

  export type AuthSumAggregateOutputType = {
    auth_id: number | null
  }

  export type AuthMinAggregateOutputType = {
    auth_id: number | null
    mail: string | null
    password: string | null
    username: string | null
    createdAt: Date | null
  }

  export type AuthMaxAggregateOutputType = {
    auth_id: number | null
    mail: string | null
    password: string | null
    username: string | null
    createdAt: Date | null
  }

  export type AuthCountAggregateOutputType = {
    auth_id: number
    mail: number
    password: number
    username: number
    createdAt: number
    _all: number
  }


  export type AuthAvgAggregateInputType = {
    auth_id?: true
  }

  export type AuthSumAggregateInputType = {
    auth_id?: true
  }

  export type AuthMinAggregateInputType = {
    auth_id?: true
    mail?: true
    password?: true
    username?: true
    createdAt?: true
  }

  export type AuthMaxAggregateInputType = {
    auth_id?: true
    mail?: true
    password?: true
    username?: true
    createdAt?: true
  }

  export type AuthCountAggregateInputType = {
    auth_id?: true
    mail?: true
    password?: true
    username?: true
    createdAt?: true
    _all?: true
  }

  export type AuthAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auth to aggregate.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Auths
    **/
    _count?: true | AuthCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuthAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuthSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthMaxAggregateInputType
  }

  export type GetAuthAggregateType<T extends AuthAggregateArgs> = {
        [P in keyof T & keyof AggregateAuth]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuth[P]>
      : GetScalarType<T[P], AggregateAuth[P]>
  }




  export type AuthGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthWhereInput
    orderBy?: AuthOrderByWithAggregationInput | AuthOrderByWithAggregationInput[]
    by: AuthScalarFieldEnum[] | AuthScalarFieldEnum
    having?: AuthScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthCountAggregateInputType | true
    _avg?: AuthAvgAggregateInputType
    _sum?: AuthSumAggregateInputType
    _min?: AuthMinAggregateInputType
    _max?: AuthMaxAggregateInputType
  }

  export type AuthGroupByOutputType = {
    auth_id: number
    mail: string
    password: string
    username: string | null
    createdAt: Date
    _count: AuthCountAggregateOutputType | null
    _avg: AuthAvgAggregateOutputType | null
    _sum: AuthSumAggregateOutputType | null
    _min: AuthMinAggregateOutputType | null
    _max: AuthMaxAggregateOutputType | null
  }

  type GetAuthGroupByPayload<T extends AuthGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthGroupByOutputType[P]>
            : GetScalarType<T[P], AuthGroupByOutputType[P]>
        }
      >
    >


  export type AuthSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    auth_id?: boolean
    mail?: boolean
    password?: boolean
    username?: boolean
    createdAt?: boolean
    student?: boolean | Auth$studentArgs<ExtArgs>
    teacher?: boolean | Auth$teacherArgs<ExtArgs>
  }, ExtArgs["result"]["auth"]>

  export type AuthSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    auth_id?: boolean
    mail?: boolean
    password?: boolean
    username?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auth"]>

  export type AuthSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    auth_id?: boolean
    mail?: boolean
    password?: boolean
    username?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auth"]>

  export type AuthSelectScalar = {
    auth_id?: boolean
    mail?: boolean
    password?: boolean
    username?: boolean
    createdAt?: boolean
  }

  export type AuthOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"auth_id" | "mail" | "password" | "username" | "createdAt", ExtArgs["result"]["auth"]>
  export type AuthInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | Auth$studentArgs<ExtArgs>
    teacher?: boolean | Auth$teacherArgs<ExtArgs>
  }
  export type AuthIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AuthIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AuthPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Auth"
    objects: {
      student: Prisma.$StAccountPayload<ExtArgs> | null
      teacher: Prisma.$TAccountPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      auth_id: number
      mail: string
      password: string
      username: string | null
      createdAt: Date
    }, ExtArgs["result"]["auth"]>
    composites: {}
  }

  type AuthGetPayload<S extends boolean | null | undefined | AuthDefaultArgs> = $Result.GetResult<Prisma.$AuthPayload, S>

  type AuthCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthCountAggregateInputType | true
    }

  export interface AuthDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Auth'], meta: { name: 'Auth' } }
    /**
     * Find zero or one Auth that matches the filter.
     * @param {AuthFindUniqueArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthFindUniqueArgs>(args: SelectSubset<T, AuthFindUniqueArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Auth that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthFindUniqueOrThrowArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auth that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthFindFirstArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthFindFirstArgs>(args?: SelectSubset<T, AuthFindFirstArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auth that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthFindFirstOrThrowArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Auths that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Auths
     * const auths = await prisma.auth.findMany()
     * 
     * // Get first 10 Auths
     * const auths = await prisma.auth.findMany({ take: 10 })
     * 
     * // Only select the `auth_id`
     * const authWithAuth_idOnly = await prisma.auth.findMany({ select: { auth_id: true } })
     * 
     */
    findMany<T extends AuthFindManyArgs>(args?: SelectSubset<T, AuthFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Auth.
     * @param {AuthCreateArgs} args - Arguments to create a Auth.
     * @example
     * // Create one Auth
     * const Auth = await prisma.auth.create({
     *   data: {
     *     // ... data to create a Auth
     *   }
     * })
     * 
     */
    create<T extends AuthCreateArgs>(args: SelectSubset<T, AuthCreateArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Auths.
     * @param {AuthCreateManyArgs} args - Arguments to create many Auths.
     * @example
     * // Create many Auths
     * const auth = await prisma.auth.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthCreateManyArgs>(args?: SelectSubset<T, AuthCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Auths and returns the data saved in the database.
     * @param {AuthCreateManyAndReturnArgs} args - Arguments to create many Auths.
     * @example
     * // Create many Auths
     * const auth = await prisma.auth.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Auths and only return the `auth_id`
     * const authWithAuth_idOnly = await prisma.auth.createManyAndReturn({
     *   select: { auth_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Auth.
     * @param {AuthDeleteArgs} args - Arguments to delete one Auth.
     * @example
     * // Delete one Auth
     * const Auth = await prisma.auth.delete({
     *   where: {
     *     // ... filter to delete one Auth
     *   }
     * })
     * 
     */
    delete<T extends AuthDeleteArgs>(args: SelectSubset<T, AuthDeleteArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Auth.
     * @param {AuthUpdateArgs} args - Arguments to update one Auth.
     * @example
     * // Update one Auth
     * const auth = await prisma.auth.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthUpdateArgs>(args: SelectSubset<T, AuthUpdateArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Auths.
     * @param {AuthDeleteManyArgs} args - Arguments to filter Auths to delete.
     * @example
     * // Delete a few Auths
     * const { count } = await prisma.auth.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthDeleteManyArgs>(args?: SelectSubset<T, AuthDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Auths
     * const auth = await prisma.auth.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthUpdateManyArgs>(args: SelectSubset<T, AuthUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auths and returns the data updated in the database.
     * @param {AuthUpdateManyAndReturnArgs} args - Arguments to update many Auths.
     * @example
     * // Update many Auths
     * const auth = await prisma.auth.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Auths and only return the `auth_id`
     * const authWithAuth_idOnly = await prisma.auth.updateManyAndReturn({
     *   select: { auth_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Auth.
     * @param {AuthUpsertArgs} args - Arguments to update or create a Auth.
     * @example
     * // Update or create a Auth
     * const auth = await prisma.auth.upsert({
     *   create: {
     *     // ... data to create a Auth
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Auth we want to update
     *   }
     * })
     */
    upsert<T extends AuthUpsertArgs>(args: SelectSubset<T, AuthUpsertArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Auths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthCountArgs} args - Arguments to filter Auths to count.
     * @example
     * // Count the number of Auths
     * const count = await prisma.auth.count({
     *   where: {
     *     // ... the filter for the Auths we want to count
     *   }
     * })
    **/
    count<T extends AuthCountArgs>(
      args?: Subset<T, AuthCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Auth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthAggregateArgs>(args: Subset<T, AuthAggregateArgs>): Prisma.PrismaPromise<GetAuthAggregateType<T>>

    /**
     * Group by Auth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthGroupByArgs['orderBy'] }
        : { orderBy?: AuthGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Auth model
   */
  readonly fields: AuthFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Auth.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends Auth$studentArgs<ExtArgs> = {}>(args?: Subset<T, Auth$studentArgs<ExtArgs>>): Prisma__StAccountClient<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    teacher<T extends Auth$teacherArgs<ExtArgs> = {}>(args?: Subset<T, Auth$teacherArgs<ExtArgs>>): Prisma__TAccountClient<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Auth model
   */
  interface AuthFieldRefs {
    readonly auth_id: FieldRef<"Auth", 'Int'>
    readonly mail: FieldRef<"Auth", 'String'>
    readonly password: FieldRef<"Auth", 'String'>
    readonly username: FieldRef<"Auth", 'String'>
    readonly createdAt: FieldRef<"Auth", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Auth findUnique
   */
  export type AuthFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth findUniqueOrThrow
   */
  export type AuthFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth findFirst
   */
  export type AuthFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auths.
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auths.
     */
    distinct?: AuthScalarFieldEnum | AuthScalarFieldEnum[]
  }

  /**
   * Auth findFirstOrThrow
   */
  export type AuthFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auths.
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auths.
     */
    distinct?: AuthScalarFieldEnum | AuthScalarFieldEnum[]
  }

  /**
   * Auth findMany
   */
  export type AuthFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auths to fetch.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Auths.
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    distinct?: AuthScalarFieldEnum | AuthScalarFieldEnum[]
  }

  /**
   * Auth create
   */
  export type AuthCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * The data needed to create a Auth.
     */
    data: XOR<AuthCreateInput, AuthUncheckedCreateInput>
  }

  /**
   * Auth createMany
   */
  export type AuthCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Auths.
     */
    data: AuthCreateManyInput | AuthCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Auth createManyAndReturn
   */
  export type AuthCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * The data used to create many Auths.
     */
    data: AuthCreateManyInput | AuthCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Auth update
   */
  export type AuthUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * The data needed to update a Auth.
     */
    data: XOR<AuthUpdateInput, AuthUncheckedUpdateInput>
    /**
     * Choose, which Auth to update.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth updateMany
   */
  export type AuthUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Auths.
     */
    data: XOR<AuthUpdateManyMutationInput, AuthUncheckedUpdateManyInput>
    /**
     * Filter which Auths to update
     */
    where?: AuthWhereInput
    /**
     * Limit how many Auths to update.
     */
    limit?: number
  }

  /**
   * Auth updateManyAndReturn
   */
  export type AuthUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * The data used to update Auths.
     */
    data: XOR<AuthUpdateManyMutationInput, AuthUncheckedUpdateManyInput>
    /**
     * Filter which Auths to update
     */
    where?: AuthWhereInput
    /**
     * Limit how many Auths to update.
     */
    limit?: number
  }

  /**
   * Auth upsert
   */
  export type AuthUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * The filter to search for the Auth to update in case it exists.
     */
    where: AuthWhereUniqueInput
    /**
     * In case the Auth found by the `where` argument doesn't exist, create a new Auth with this data.
     */
    create: XOR<AuthCreateInput, AuthUncheckedCreateInput>
    /**
     * In case the Auth was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthUpdateInput, AuthUncheckedUpdateInput>
  }

  /**
   * Auth delete
   */
  export type AuthDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter which Auth to delete.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth deleteMany
   */
  export type AuthDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auths to delete
     */
    where?: AuthWhereInput
    /**
     * Limit how many Auths to delete.
     */
    limit?: number
  }

  /**
   * Auth.student
   */
  export type Auth$studentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountInclude<ExtArgs> | null
    where?: StAccountWhereInput
  }

  /**
   * Auth.teacher
   */
  export type Auth$teacherArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
    where?: TAccountWhereInput
  }

  /**
   * Auth without action
   */
  export type AuthDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
  }


  /**
   * Model StAccount
   */

  export type AggregateStAccount = {
    _count: StAccountCountAggregateOutputType | null
    _avg: StAccountAvgAggregateOutputType | null
    _sum: StAccountSumAggregateOutputType | null
    _min: StAccountMinAggregateOutputType | null
    _max: StAccountMaxAggregateOutputType | null
  }

  export type StAccountAvgAggregateOutputType = {
    s_id: number | null
    auth_id: number | null
  }

  export type StAccountSumAggregateOutputType = {
    s_id: number | null
    auth_id: number | null
  }

  export type StAccountMinAggregateOutputType = {
    s_id: number | null
    auth_id: number | null
    name: string | null
    is_demo: boolean | null
    updated_at: Date | null
  }

  export type StAccountMaxAggregateOutputType = {
    s_id: number | null
    auth_id: number | null
    name: string | null
    is_demo: boolean | null
    updated_at: Date | null
  }

  export type StAccountCountAggregateOutputType = {
    s_id: number
    auth_id: number
    name: number
    is_demo: number
    updated_at: number
    _all: number
  }


  export type StAccountAvgAggregateInputType = {
    s_id?: true
    auth_id?: true
  }

  export type StAccountSumAggregateInputType = {
    s_id?: true
    auth_id?: true
  }

  export type StAccountMinAggregateInputType = {
    s_id?: true
    auth_id?: true
    name?: true
    is_demo?: true
    updated_at?: true
  }

  export type StAccountMaxAggregateInputType = {
    s_id?: true
    auth_id?: true
    name?: true
    is_demo?: true
    updated_at?: true
  }

  export type StAccountCountAggregateInputType = {
    s_id?: true
    auth_id?: true
    name?: true
    is_demo?: true
    updated_at?: true
    _all?: true
  }

  export type StAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StAccount to aggregate.
     */
    where?: StAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StAccounts to fetch.
     */
    orderBy?: StAccountOrderByWithRelationInput | StAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StAccounts
    **/
    _count?: true | StAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StAccountMaxAggregateInputType
  }

  export type GetStAccountAggregateType<T extends StAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateStAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStAccount[P]>
      : GetScalarType<T[P], AggregateStAccount[P]>
  }




  export type StAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StAccountWhereInput
    orderBy?: StAccountOrderByWithAggregationInput | StAccountOrderByWithAggregationInput[]
    by: StAccountScalarFieldEnum[] | StAccountScalarFieldEnum
    having?: StAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StAccountCountAggregateInputType | true
    _avg?: StAccountAvgAggregateInputType
    _sum?: StAccountSumAggregateInputType
    _min?: StAccountMinAggregateInputType
    _max?: StAccountMaxAggregateInputType
  }

  export type StAccountGroupByOutputType = {
    s_id: number
    auth_id: number
    name: string
    is_demo: boolean
    updated_at: Date | null
    _count: StAccountCountAggregateOutputType | null
    _avg: StAccountAvgAggregateOutputType | null
    _sum: StAccountSumAggregateOutputType | null
    _min: StAccountMinAggregateOutputType | null
    _max: StAccountMaxAggregateOutputType | null
  }

  type GetStAccountGroupByPayload<T extends StAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StAccountGroupByOutputType[P]>
            : GetScalarType<T[P], StAccountGroupByOutputType[P]>
        }
      >
    >


  export type StAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    s_id?: boolean
    auth_id?: boolean
    name?: boolean
    is_demo?: boolean
    updated_at?: boolean
    auth?: boolean | AuthDefaultArgs<ExtArgs>
    plans?: boolean | StAccount$plansArgs<ExtArgs>
    classes?: boolean | StAccount$classesArgs<ExtArgs>
    _count?: boolean | StAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stAccount"]>

  export type StAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    s_id?: boolean
    auth_id?: boolean
    name?: boolean
    is_demo?: boolean
    updated_at?: boolean
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stAccount"]>

  export type StAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    s_id?: boolean
    auth_id?: boolean
    name?: boolean
    is_demo?: boolean
    updated_at?: boolean
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stAccount"]>

  export type StAccountSelectScalar = {
    s_id?: boolean
    auth_id?: boolean
    name?: boolean
    is_demo?: boolean
    updated_at?: boolean
  }

  export type StAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"s_id" | "auth_id" | "name" | "is_demo" | "updated_at", ExtArgs["result"]["stAccount"]>
  export type StAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auth?: boolean | AuthDefaultArgs<ExtArgs>
    plans?: boolean | StAccount$plansArgs<ExtArgs>
    classes?: boolean | StAccount$classesArgs<ExtArgs>
    _count?: boolean | StAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }
  export type StAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }

  export type $StAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StAccount"
    objects: {
      auth: Prisma.$AuthPayload<ExtArgs>
      plans: Prisma.$PlanRecordPayload<ExtArgs>[]
      classes: Prisma.$ClassRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      s_id: number
      auth_id: number
      name: string
      is_demo: boolean
      updated_at: Date | null
    }, ExtArgs["result"]["stAccount"]>
    composites: {}
  }

  type StAccountGetPayload<S extends boolean | null | undefined | StAccountDefaultArgs> = $Result.GetResult<Prisma.$StAccountPayload, S>

  type StAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StAccountCountAggregateInputType | true
    }

  export interface StAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StAccount'], meta: { name: 'StAccount' } }
    /**
     * Find zero or one StAccount that matches the filter.
     * @param {StAccountFindUniqueArgs} args - Arguments to find a StAccount
     * @example
     * // Get one StAccount
     * const stAccount = await prisma.stAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StAccountFindUniqueArgs>(args: SelectSubset<T, StAccountFindUniqueArgs<ExtArgs>>): Prisma__StAccountClient<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StAccountFindUniqueOrThrowArgs} args - Arguments to find a StAccount
     * @example
     * // Get one StAccount
     * const stAccount = await prisma.stAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, StAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StAccountClient<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StAccountFindFirstArgs} args - Arguments to find a StAccount
     * @example
     * // Get one StAccount
     * const stAccount = await prisma.stAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StAccountFindFirstArgs>(args?: SelectSubset<T, StAccountFindFirstArgs<ExtArgs>>): Prisma__StAccountClient<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StAccountFindFirstOrThrowArgs} args - Arguments to find a StAccount
     * @example
     * // Get one StAccount
     * const stAccount = await prisma.stAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, StAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__StAccountClient<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StAccounts
     * const stAccounts = await prisma.stAccount.findMany()
     * 
     * // Get first 10 StAccounts
     * const stAccounts = await prisma.stAccount.findMany({ take: 10 })
     * 
     * // Only select the `s_id`
     * const stAccountWithS_idOnly = await prisma.stAccount.findMany({ select: { s_id: true } })
     * 
     */
    findMany<T extends StAccountFindManyArgs>(args?: SelectSubset<T, StAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StAccount.
     * @param {StAccountCreateArgs} args - Arguments to create a StAccount.
     * @example
     * // Create one StAccount
     * const StAccount = await prisma.stAccount.create({
     *   data: {
     *     // ... data to create a StAccount
     *   }
     * })
     * 
     */
    create<T extends StAccountCreateArgs>(args: SelectSubset<T, StAccountCreateArgs<ExtArgs>>): Prisma__StAccountClient<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StAccounts.
     * @param {StAccountCreateManyArgs} args - Arguments to create many StAccounts.
     * @example
     * // Create many StAccounts
     * const stAccount = await prisma.stAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StAccountCreateManyArgs>(args?: SelectSubset<T, StAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StAccounts and returns the data saved in the database.
     * @param {StAccountCreateManyAndReturnArgs} args - Arguments to create many StAccounts.
     * @example
     * // Create many StAccounts
     * const stAccount = await prisma.stAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StAccounts and only return the `s_id`
     * const stAccountWithS_idOnly = await prisma.stAccount.createManyAndReturn({
     *   select: { s_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, StAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StAccount.
     * @param {StAccountDeleteArgs} args - Arguments to delete one StAccount.
     * @example
     * // Delete one StAccount
     * const StAccount = await prisma.stAccount.delete({
     *   where: {
     *     // ... filter to delete one StAccount
     *   }
     * })
     * 
     */
    delete<T extends StAccountDeleteArgs>(args: SelectSubset<T, StAccountDeleteArgs<ExtArgs>>): Prisma__StAccountClient<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StAccount.
     * @param {StAccountUpdateArgs} args - Arguments to update one StAccount.
     * @example
     * // Update one StAccount
     * const stAccount = await prisma.stAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StAccountUpdateArgs>(args: SelectSubset<T, StAccountUpdateArgs<ExtArgs>>): Prisma__StAccountClient<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StAccounts.
     * @param {StAccountDeleteManyArgs} args - Arguments to filter StAccounts to delete.
     * @example
     * // Delete a few StAccounts
     * const { count } = await prisma.stAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StAccountDeleteManyArgs>(args?: SelectSubset<T, StAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StAccounts
     * const stAccount = await prisma.stAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StAccountUpdateManyArgs>(args: SelectSubset<T, StAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StAccounts and returns the data updated in the database.
     * @param {StAccountUpdateManyAndReturnArgs} args - Arguments to update many StAccounts.
     * @example
     * // Update many StAccounts
     * const stAccount = await prisma.stAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StAccounts and only return the `s_id`
     * const stAccountWithS_idOnly = await prisma.stAccount.updateManyAndReturn({
     *   select: { s_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, StAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StAccount.
     * @param {StAccountUpsertArgs} args - Arguments to update or create a StAccount.
     * @example
     * // Update or create a StAccount
     * const stAccount = await prisma.stAccount.upsert({
     *   create: {
     *     // ... data to create a StAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StAccount we want to update
     *   }
     * })
     */
    upsert<T extends StAccountUpsertArgs>(args: SelectSubset<T, StAccountUpsertArgs<ExtArgs>>): Prisma__StAccountClient<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StAccountCountArgs} args - Arguments to filter StAccounts to count.
     * @example
     * // Count the number of StAccounts
     * const count = await prisma.stAccount.count({
     *   where: {
     *     // ... the filter for the StAccounts we want to count
     *   }
     * })
    **/
    count<T extends StAccountCountArgs>(
      args?: Subset<T, StAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StAccountAggregateArgs>(args: Subset<T, StAccountAggregateArgs>): Prisma.PrismaPromise<GetStAccountAggregateType<T>>

    /**
     * Group by StAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StAccountGroupByArgs['orderBy'] }
        : { orderBy?: StAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StAccount model
   */
  readonly fields: StAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auth<T extends AuthDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthDefaultArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    plans<T extends StAccount$plansArgs<ExtArgs> = {}>(args?: Subset<T, StAccount$plansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    classes<T extends StAccount$classesArgs<ExtArgs> = {}>(args?: Subset<T, StAccount$classesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StAccount model
   */
  interface StAccountFieldRefs {
    readonly s_id: FieldRef<"StAccount", 'Int'>
    readonly auth_id: FieldRef<"StAccount", 'Int'>
    readonly name: FieldRef<"StAccount", 'String'>
    readonly is_demo: FieldRef<"StAccount", 'Boolean'>
    readonly updated_at: FieldRef<"StAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StAccount findUnique
   */
  export type StAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountInclude<ExtArgs> | null
    /**
     * Filter, which StAccount to fetch.
     */
    where: StAccountWhereUniqueInput
  }

  /**
   * StAccount findUniqueOrThrow
   */
  export type StAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountInclude<ExtArgs> | null
    /**
     * Filter, which StAccount to fetch.
     */
    where: StAccountWhereUniqueInput
  }

  /**
   * StAccount findFirst
   */
  export type StAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountInclude<ExtArgs> | null
    /**
     * Filter, which StAccount to fetch.
     */
    where?: StAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StAccounts to fetch.
     */
    orderBy?: StAccountOrderByWithRelationInput | StAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StAccounts.
     */
    cursor?: StAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StAccounts.
     */
    distinct?: StAccountScalarFieldEnum | StAccountScalarFieldEnum[]
  }

  /**
   * StAccount findFirstOrThrow
   */
  export type StAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountInclude<ExtArgs> | null
    /**
     * Filter, which StAccount to fetch.
     */
    where?: StAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StAccounts to fetch.
     */
    orderBy?: StAccountOrderByWithRelationInput | StAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StAccounts.
     */
    cursor?: StAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StAccounts.
     */
    distinct?: StAccountScalarFieldEnum | StAccountScalarFieldEnum[]
  }

  /**
   * StAccount findMany
   */
  export type StAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountInclude<ExtArgs> | null
    /**
     * Filter, which StAccounts to fetch.
     */
    where?: StAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StAccounts to fetch.
     */
    orderBy?: StAccountOrderByWithRelationInput | StAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StAccounts.
     */
    cursor?: StAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StAccounts.
     */
    skip?: number
    distinct?: StAccountScalarFieldEnum | StAccountScalarFieldEnum[]
  }

  /**
   * StAccount create
   */
  export type StAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a StAccount.
     */
    data: XOR<StAccountCreateInput, StAccountUncheckedCreateInput>
  }

  /**
   * StAccount createMany
   */
  export type StAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StAccounts.
     */
    data: StAccountCreateManyInput | StAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StAccount createManyAndReturn
   */
  export type StAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * The data used to create many StAccounts.
     */
    data: StAccountCreateManyInput | StAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StAccount update
   */
  export type StAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a StAccount.
     */
    data: XOR<StAccountUpdateInput, StAccountUncheckedUpdateInput>
    /**
     * Choose, which StAccount to update.
     */
    where: StAccountWhereUniqueInput
  }

  /**
   * StAccount updateMany
   */
  export type StAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StAccounts.
     */
    data: XOR<StAccountUpdateManyMutationInput, StAccountUncheckedUpdateManyInput>
    /**
     * Filter which StAccounts to update
     */
    where?: StAccountWhereInput
    /**
     * Limit how many StAccounts to update.
     */
    limit?: number
  }

  /**
   * StAccount updateManyAndReturn
   */
  export type StAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * The data used to update StAccounts.
     */
    data: XOR<StAccountUpdateManyMutationInput, StAccountUncheckedUpdateManyInput>
    /**
     * Filter which StAccounts to update
     */
    where?: StAccountWhereInput
    /**
     * Limit how many StAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StAccount upsert
   */
  export type StAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the StAccount to update in case it exists.
     */
    where: StAccountWhereUniqueInput
    /**
     * In case the StAccount found by the `where` argument doesn't exist, create a new StAccount with this data.
     */
    create: XOR<StAccountCreateInput, StAccountUncheckedCreateInput>
    /**
     * In case the StAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StAccountUpdateInput, StAccountUncheckedUpdateInput>
  }

  /**
   * StAccount delete
   */
  export type StAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountInclude<ExtArgs> | null
    /**
     * Filter which StAccount to delete.
     */
    where: StAccountWhereUniqueInput
  }

  /**
   * StAccount deleteMany
   */
  export type StAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StAccounts to delete
     */
    where?: StAccountWhereInput
    /**
     * Limit how many StAccounts to delete.
     */
    limit?: number
  }

  /**
   * StAccount.plans
   */
  export type StAccount$plansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
    where?: PlanRecordWhereInput
    orderBy?: PlanRecordOrderByWithRelationInput | PlanRecordOrderByWithRelationInput[]
    cursor?: PlanRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlanRecordScalarFieldEnum | PlanRecordScalarFieldEnum[]
  }

  /**
   * StAccount.classes
   */
  export type StAccount$classesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    where?: ClassRecordWhereInput
    orderBy?: ClassRecordOrderByWithRelationInput | ClassRecordOrderByWithRelationInput[]
    cursor?: ClassRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClassRecordScalarFieldEnum | ClassRecordScalarFieldEnum[]
  }

  /**
   * StAccount without action
   */
  export type StAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StAccount
     */
    select?: StAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StAccount
     */
    omit?: StAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StAccountInclude<ExtArgs> | null
  }


  /**
   * Model Specialization
   */

  export type AggregateSpecialization = {
    _count: SpecializationCountAggregateOutputType | null
    _avg: SpecializationAvgAggregateOutputType | null
    _sum: SpecializationSumAggregateOutputType | null
    _min: SpecializationMinAggregateOutputType | null
    _max: SpecializationMaxAggregateOutputType | null
  }

  export type SpecializationAvgAggregateOutputType = {
    id: number | null
  }

  export type SpecializationSumAggregateOutputType = {
    id: number | null
  }

  export type SpecializationMinAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type SpecializationMaxAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type SpecializationCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type SpecializationAvgAggregateInputType = {
    id?: true
  }

  export type SpecializationSumAggregateInputType = {
    id?: true
  }

  export type SpecializationMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type SpecializationMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type SpecializationCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type SpecializationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Specialization to aggregate.
     */
    where?: SpecializationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Specializations to fetch.
     */
    orderBy?: SpecializationOrderByWithRelationInput | SpecializationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpecializationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Specializations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Specializations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Specializations
    **/
    _count?: true | SpecializationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SpecializationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SpecializationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpecializationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpecializationMaxAggregateInputType
  }

  export type GetSpecializationAggregateType<T extends SpecializationAggregateArgs> = {
        [P in keyof T & keyof AggregateSpecialization]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpecialization[P]>
      : GetScalarType<T[P], AggregateSpecialization[P]>
  }




  export type SpecializationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpecializationWhereInput
    orderBy?: SpecializationOrderByWithAggregationInput | SpecializationOrderByWithAggregationInput[]
    by: SpecializationScalarFieldEnum[] | SpecializationScalarFieldEnum
    having?: SpecializationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpecializationCountAggregateInputType | true
    _avg?: SpecializationAvgAggregateInputType
    _sum?: SpecializationSumAggregateInputType
    _min?: SpecializationMinAggregateInputType
    _max?: SpecializationMaxAggregateInputType
  }

  export type SpecializationGroupByOutputType = {
    id: number
    name: string
    _count: SpecializationCountAggregateOutputType | null
    _avg: SpecializationAvgAggregateOutputType | null
    _sum: SpecializationSumAggregateOutputType | null
    _min: SpecializationMinAggregateOutputType | null
    _max: SpecializationMaxAggregateOutputType | null
  }

  type GetSpecializationGroupByPayload<T extends SpecializationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpecializationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpecializationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpecializationGroupByOutputType[P]>
            : GetScalarType<T[P], SpecializationGroupByOutputType[P]>
        }
      >
    >


  export type SpecializationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    teachers?: boolean | Specialization$teachersArgs<ExtArgs>
    _count?: boolean | SpecializationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["specialization"]>

  export type SpecializationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["specialization"]>

  export type SpecializationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["specialization"]>

  export type SpecializationSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type SpecializationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name", ExtArgs["result"]["specialization"]>
  export type SpecializationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    teachers?: boolean | Specialization$teachersArgs<ExtArgs>
    _count?: boolean | SpecializationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SpecializationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SpecializationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SpecializationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Specialization"
    objects: {
      teachers: Prisma.$TAccountPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
    }, ExtArgs["result"]["specialization"]>
    composites: {}
  }

  type SpecializationGetPayload<S extends boolean | null | undefined | SpecializationDefaultArgs> = $Result.GetResult<Prisma.$SpecializationPayload, S>

  type SpecializationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SpecializationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpecializationCountAggregateInputType | true
    }

  export interface SpecializationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Specialization'], meta: { name: 'Specialization' } }
    /**
     * Find zero or one Specialization that matches the filter.
     * @param {SpecializationFindUniqueArgs} args - Arguments to find a Specialization
     * @example
     * // Get one Specialization
     * const specialization = await prisma.specialization.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpecializationFindUniqueArgs>(args: SelectSubset<T, SpecializationFindUniqueArgs<ExtArgs>>): Prisma__SpecializationClient<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Specialization that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SpecializationFindUniqueOrThrowArgs} args - Arguments to find a Specialization
     * @example
     * // Get one Specialization
     * const specialization = await prisma.specialization.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpecializationFindUniqueOrThrowArgs>(args: SelectSubset<T, SpecializationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpecializationClient<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Specialization that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpecializationFindFirstArgs} args - Arguments to find a Specialization
     * @example
     * // Get one Specialization
     * const specialization = await prisma.specialization.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpecializationFindFirstArgs>(args?: SelectSubset<T, SpecializationFindFirstArgs<ExtArgs>>): Prisma__SpecializationClient<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Specialization that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpecializationFindFirstOrThrowArgs} args - Arguments to find a Specialization
     * @example
     * // Get one Specialization
     * const specialization = await prisma.specialization.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpecializationFindFirstOrThrowArgs>(args?: SelectSubset<T, SpecializationFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpecializationClient<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Specializations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpecializationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Specializations
     * const specializations = await prisma.specialization.findMany()
     * 
     * // Get first 10 Specializations
     * const specializations = await prisma.specialization.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const specializationWithIdOnly = await prisma.specialization.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SpecializationFindManyArgs>(args?: SelectSubset<T, SpecializationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Specialization.
     * @param {SpecializationCreateArgs} args - Arguments to create a Specialization.
     * @example
     * // Create one Specialization
     * const Specialization = await prisma.specialization.create({
     *   data: {
     *     // ... data to create a Specialization
     *   }
     * })
     * 
     */
    create<T extends SpecializationCreateArgs>(args: SelectSubset<T, SpecializationCreateArgs<ExtArgs>>): Prisma__SpecializationClient<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Specializations.
     * @param {SpecializationCreateManyArgs} args - Arguments to create many Specializations.
     * @example
     * // Create many Specializations
     * const specialization = await prisma.specialization.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpecializationCreateManyArgs>(args?: SelectSubset<T, SpecializationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Specializations and returns the data saved in the database.
     * @param {SpecializationCreateManyAndReturnArgs} args - Arguments to create many Specializations.
     * @example
     * // Create many Specializations
     * const specialization = await prisma.specialization.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Specializations and only return the `id`
     * const specializationWithIdOnly = await prisma.specialization.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpecializationCreateManyAndReturnArgs>(args?: SelectSubset<T, SpecializationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Specialization.
     * @param {SpecializationDeleteArgs} args - Arguments to delete one Specialization.
     * @example
     * // Delete one Specialization
     * const Specialization = await prisma.specialization.delete({
     *   where: {
     *     // ... filter to delete one Specialization
     *   }
     * })
     * 
     */
    delete<T extends SpecializationDeleteArgs>(args: SelectSubset<T, SpecializationDeleteArgs<ExtArgs>>): Prisma__SpecializationClient<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Specialization.
     * @param {SpecializationUpdateArgs} args - Arguments to update one Specialization.
     * @example
     * // Update one Specialization
     * const specialization = await prisma.specialization.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpecializationUpdateArgs>(args: SelectSubset<T, SpecializationUpdateArgs<ExtArgs>>): Prisma__SpecializationClient<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Specializations.
     * @param {SpecializationDeleteManyArgs} args - Arguments to filter Specializations to delete.
     * @example
     * // Delete a few Specializations
     * const { count } = await prisma.specialization.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpecializationDeleteManyArgs>(args?: SelectSubset<T, SpecializationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Specializations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpecializationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Specializations
     * const specialization = await prisma.specialization.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpecializationUpdateManyArgs>(args: SelectSubset<T, SpecializationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Specializations and returns the data updated in the database.
     * @param {SpecializationUpdateManyAndReturnArgs} args - Arguments to update many Specializations.
     * @example
     * // Update many Specializations
     * const specialization = await prisma.specialization.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Specializations and only return the `id`
     * const specializationWithIdOnly = await prisma.specialization.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SpecializationUpdateManyAndReturnArgs>(args: SelectSubset<T, SpecializationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Specialization.
     * @param {SpecializationUpsertArgs} args - Arguments to update or create a Specialization.
     * @example
     * // Update or create a Specialization
     * const specialization = await prisma.specialization.upsert({
     *   create: {
     *     // ... data to create a Specialization
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Specialization we want to update
     *   }
     * })
     */
    upsert<T extends SpecializationUpsertArgs>(args: SelectSubset<T, SpecializationUpsertArgs<ExtArgs>>): Prisma__SpecializationClient<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Specializations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpecializationCountArgs} args - Arguments to filter Specializations to count.
     * @example
     * // Count the number of Specializations
     * const count = await prisma.specialization.count({
     *   where: {
     *     // ... the filter for the Specializations we want to count
     *   }
     * })
    **/
    count<T extends SpecializationCountArgs>(
      args?: Subset<T, SpecializationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpecializationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Specialization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpecializationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpecializationAggregateArgs>(args: Subset<T, SpecializationAggregateArgs>): Prisma.PrismaPromise<GetSpecializationAggregateType<T>>

    /**
     * Group by Specialization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpecializationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SpecializationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpecializationGroupByArgs['orderBy'] }
        : { orderBy?: SpecializationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SpecializationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpecializationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Specialization model
   */
  readonly fields: SpecializationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Specialization.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpecializationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    teachers<T extends Specialization$teachersArgs<ExtArgs> = {}>(args?: Subset<T, Specialization$teachersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Specialization model
   */
  interface SpecializationFieldRefs {
    readonly id: FieldRef<"Specialization", 'Int'>
    readonly name: FieldRef<"Specialization", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Specialization findUnique
   */
  export type SpecializationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpecializationInclude<ExtArgs> | null
    /**
     * Filter, which Specialization to fetch.
     */
    where: SpecializationWhereUniqueInput
  }

  /**
   * Specialization findUniqueOrThrow
   */
  export type SpecializationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpecializationInclude<ExtArgs> | null
    /**
     * Filter, which Specialization to fetch.
     */
    where: SpecializationWhereUniqueInput
  }

  /**
   * Specialization findFirst
   */
  export type SpecializationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpecializationInclude<ExtArgs> | null
    /**
     * Filter, which Specialization to fetch.
     */
    where?: SpecializationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Specializations to fetch.
     */
    orderBy?: SpecializationOrderByWithRelationInput | SpecializationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Specializations.
     */
    cursor?: SpecializationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Specializations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Specializations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Specializations.
     */
    distinct?: SpecializationScalarFieldEnum | SpecializationScalarFieldEnum[]
  }

  /**
   * Specialization findFirstOrThrow
   */
  export type SpecializationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpecializationInclude<ExtArgs> | null
    /**
     * Filter, which Specialization to fetch.
     */
    where?: SpecializationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Specializations to fetch.
     */
    orderBy?: SpecializationOrderByWithRelationInput | SpecializationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Specializations.
     */
    cursor?: SpecializationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Specializations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Specializations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Specializations.
     */
    distinct?: SpecializationScalarFieldEnum | SpecializationScalarFieldEnum[]
  }

  /**
   * Specialization findMany
   */
  export type SpecializationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpecializationInclude<ExtArgs> | null
    /**
     * Filter, which Specializations to fetch.
     */
    where?: SpecializationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Specializations to fetch.
     */
    orderBy?: SpecializationOrderByWithRelationInput | SpecializationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Specializations.
     */
    cursor?: SpecializationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Specializations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Specializations.
     */
    skip?: number
    distinct?: SpecializationScalarFieldEnum | SpecializationScalarFieldEnum[]
  }

  /**
   * Specialization create
   */
  export type SpecializationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpecializationInclude<ExtArgs> | null
    /**
     * The data needed to create a Specialization.
     */
    data: XOR<SpecializationCreateInput, SpecializationUncheckedCreateInput>
  }

  /**
   * Specialization createMany
   */
  export type SpecializationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Specializations.
     */
    data: SpecializationCreateManyInput | SpecializationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Specialization createManyAndReturn
   */
  export type SpecializationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * The data used to create many Specializations.
     */
    data: SpecializationCreateManyInput | SpecializationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Specialization update
   */
  export type SpecializationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpecializationInclude<ExtArgs> | null
    /**
     * The data needed to update a Specialization.
     */
    data: XOR<SpecializationUpdateInput, SpecializationUncheckedUpdateInput>
    /**
     * Choose, which Specialization to update.
     */
    where: SpecializationWhereUniqueInput
  }

  /**
   * Specialization updateMany
   */
  export type SpecializationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Specializations.
     */
    data: XOR<SpecializationUpdateManyMutationInput, SpecializationUncheckedUpdateManyInput>
    /**
     * Filter which Specializations to update
     */
    where?: SpecializationWhereInput
    /**
     * Limit how many Specializations to update.
     */
    limit?: number
  }

  /**
   * Specialization updateManyAndReturn
   */
  export type SpecializationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * The data used to update Specializations.
     */
    data: XOR<SpecializationUpdateManyMutationInput, SpecializationUncheckedUpdateManyInput>
    /**
     * Filter which Specializations to update
     */
    where?: SpecializationWhereInput
    /**
     * Limit how many Specializations to update.
     */
    limit?: number
  }

  /**
   * Specialization upsert
   */
  export type SpecializationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpecializationInclude<ExtArgs> | null
    /**
     * The filter to search for the Specialization to update in case it exists.
     */
    where: SpecializationWhereUniqueInput
    /**
     * In case the Specialization found by the `where` argument doesn't exist, create a new Specialization with this data.
     */
    create: XOR<SpecializationCreateInput, SpecializationUncheckedCreateInput>
    /**
     * In case the Specialization was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpecializationUpdateInput, SpecializationUncheckedUpdateInput>
  }

  /**
   * Specialization delete
   */
  export type SpecializationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpecializationInclude<ExtArgs> | null
    /**
     * Filter which Specialization to delete.
     */
    where: SpecializationWhereUniqueInput
  }

  /**
   * Specialization deleteMany
   */
  export type SpecializationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Specializations to delete
     */
    where?: SpecializationWhereInput
    /**
     * Limit how many Specializations to delete.
     */
    limit?: number
  }

  /**
   * Specialization.teachers
   */
  export type Specialization$teachersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
    where?: TAccountWhereInput
    orderBy?: TAccountOrderByWithRelationInput | TAccountOrderByWithRelationInput[]
    cursor?: TAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TAccountScalarFieldEnum | TAccountScalarFieldEnum[]
  }

  /**
   * Specialization without action
   */
  export type SpecializationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpecializationInclude<ExtArgs> | null
  }


  /**
   * Model TAccount
   */

  export type AggregateTAccount = {
    _count: TAccountCountAggregateOutputType | null
    _avg: TAccountAvgAggregateOutputType | null
    _sum: TAccountSumAggregateOutputType | null
    _min: TAccountMinAggregateOutputType | null
    _max: TAccountMaxAggregateOutputType | null
  }

  export type TAccountAvgAggregateOutputType = {
    t_id: number | null
    auth_id: number | null
    rating: number | null
  }

  export type TAccountSumAggregateOutputType = {
    t_id: number | null
    auth_id: number | null
    rating: number | null
  }

  export type TAccountMinAggregateOutputType = {
    t_id: number | null
    auth_id: number | null
    name: string | null
    bio: string | null
    rating: number | null
    updated_at: Date | null
  }

  export type TAccountMaxAggregateOutputType = {
    t_id: number | null
    auth_id: number | null
    name: string | null
    bio: string | null
    rating: number | null
    updated_at: Date | null
  }

  export type TAccountCountAggregateOutputType = {
    t_id: number
    auth_id: number
    name: number
    bio: number
    rating: number
    updated_at: number
    _all: number
  }


  export type TAccountAvgAggregateInputType = {
    t_id?: true
    auth_id?: true
    rating?: true
  }

  export type TAccountSumAggregateInputType = {
    t_id?: true
    auth_id?: true
    rating?: true
  }

  export type TAccountMinAggregateInputType = {
    t_id?: true
    auth_id?: true
    name?: true
    bio?: true
    rating?: true
    updated_at?: true
  }

  export type TAccountMaxAggregateInputType = {
    t_id?: true
    auth_id?: true
    name?: true
    bio?: true
    rating?: true
    updated_at?: true
  }

  export type TAccountCountAggregateInputType = {
    t_id?: true
    auth_id?: true
    name?: true
    bio?: true
    rating?: true
    updated_at?: true
    _all?: true
  }

  export type TAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TAccount to aggregate.
     */
    where?: TAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TAccounts to fetch.
     */
    orderBy?: TAccountOrderByWithRelationInput | TAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TAccounts
    **/
    _count?: true | TAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TAccountMaxAggregateInputType
  }

  export type GetTAccountAggregateType<T extends TAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateTAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTAccount[P]>
      : GetScalarType<T[P], AggregateTAccount[P]>
  }




  export type TAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TAccountWhereInput
    orderBy?: TAccountOrderByWithAggregationInput | TAccountOrderByWithAggregationInput[]
    by: TAccountScalarFieldEnum[] | TAccountScalarFieldEnum
    having?: TAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TAccountCountAggregateInputType | true
    _avg?: TAccountAvgAggregateInputType
    _sum?: TAccountSumAggregateInputType
    _min?: TAccountMinAggregateInputType
    _max?: TAccountMaxAggregateInputType
  }

  export type TAccountGroupByOutputType = {
    t_id: number
    auth_id: number
    name: string
    bio: string | null
    rating: number | null
    updated_at: Date | null
    _count: TAccountCountAggregateOutputType | null
    _avg: TAccountAvgAggregateOutputType | null
    _sum: TAccountSumAggregateOutputType | null
    _min: TAccountMinAggregateOutputType | null
    _max: TAccountMaxAggregateOutputType | null
  }

  type GetTAccountGroupByPayload<T extends TAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TAccountGroupByOutputType[P]>
            : GetScalarType<T[P], TAccountGroupByOutputType[P]>
        }
      >
    >


  export type TAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    t_id?: boolean
    auth_id?: boolean
    name?: boolean
    bio?: boolean
    rating?: boolean
    updated_at?: boolean
    auth?: boolean | AuthDefaultArgs<ExtArgs>
    specs?: boolean | TAccount$specsArgs<ExtArgs>
    classes?: boolean | TAccount$classesArgs<ExtArgs>
    _count?: boolean | TAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tAccount"]>

  export type TAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    t_id?: boolean
    auth_id?: boolean
    name?: boolean
    bio?: boolean
    rating?: boolean
    updated_at?: boolean
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tAccount"]>

  export type TAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    t_id?: boolean
    auth_id?: boolean
    name?: boolean
    bio?: boolean
    rating?: boolean
    updated_at?: boolean
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tAccount"]>

  export type TAccountSelectScalar = {
    t_id?: boolean
    auth_id?: boolean
    name?: boolean
    bio?: boolean
    rating?: boolean
    updated_at?: boolean
  }

  export type TAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"t_id" | "auth_id" | "name" | "bio" | "rating" | "updated_at", ExtArgs["result"]["tAccount"]>
  export type TAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auth?: boolean | AuthDefaultArgs<ExtArgs>
    specs?: boolean | TAccount$specsArgs<ExtArgs>
    classes?: boolean | TAccount$classesArgs<ExtArgs>
    _count?: boolean | TAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }
  export type TAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }

  export type $TAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TAccount"
    objects: {
      auth: Prisma.$AuthPayload<ExtArgs>
      specs: Prisma.$SpecializationPayload<ExtArgs>[]
      classes: Prisma.$ClassRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      t_id: number
      auth_id: number
      name: string
      bio: string | null
      rating: number | null
      updated_at: Date | null
    }, ExtArgs["result"]["tAccount"]>
    composites: {}
  }

  type TAccountGetPayload<S extends boolean | null | undefined | TAccountDefaultArgs> = $Result.GetResult<Prisma.$TAccountPayload, S>

  type TAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TAccountCountAggregateInputType | true
    }

  export interface TAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TAccount'], meta: { name: 'TAccount' } }
    /**
     * Find zero or one TAccount that matches the filter.
     * @param {TAccountFindUniqueArgs} args - Arguments to find a TAccount
     * @example
     * // Get one TAccount
     * const tAccount = await prisma.tAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TAccountFindUniqueArgs>(args: SelectSubset<T, TAccountFindUniqueArgs<ExtArgs>>): Prisma__TAccountClient<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TAccountFindUniqueOrThrowArgs} args - Arguments to find a TAccount
     * @example
     * // Get one TAccount
     * const tAccount = await prisma.tAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, TAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TAccountClient<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TAccountFindFirstArgs} args - Arguments to find a TAccount
     * @example
     * // Get one TAccount
     * const tAccount = await prisma.tAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TAccountFindFirstArgs>(args?: SelectSubset<T, TAccountFindFirstArgs<ExtArgs>>): Prisma__TAccountClient<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TAccountFindFirstOrThrowArgs} args - Arguments to find a TAccount
     * @example
     * // Get one TAccount
     * const tAccount = await prisma.tAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, TAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__TAccountClient<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TAccounts
     * const tAccounts = await prisma.tAccount.findMany()
     * 
     * // Get first 10 TAccounts
     * const tAccounts = await prisma.tAccount.findMany({ take: 10 })
     * 
     * // Only select the `t_id`
     * const tAccountWithT_idOnly = await prisma.tAccount.findMany({ select: { t_id: true } })
     * 
     */
    findMany<T extends TAccountFindManyArgs>(args?: SelectSubset<T, TAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TAccount.
     * @param {TAccountCreateArgs} args - Arguments to create a TAccount.
     * @example
     * // Create one TAccount
     * const TAccount = await prisma.tAccount.create({
     *   data: {
     *     // ... data to create a TAccount
     *   }
     * })
     * 
     */
    create<T extends TAccountCreateArgs>(args: SelectSubset<T, TAccountCreateArgs<ExtArgs>>): Prisma__TAccountClient<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TAccounts.
     * @param {TAccountCreateManyArgs} args - Arguments to create many TAccounts.
     * @example
     * // Create many TAccounts
     * const tAccount = await prisma.tAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TAccountCreateManyArgs>(args?: SelectSubset<T, TAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TAccounts and returns the data saved in the database.
     * @param {TAccountCreateManyAndReturnArgs} args - Arguments to create many TAccounts.
     * @example
     * // Create many TAccounts
     * const tAccount = await prisma.tAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TAccounts and only return the `t_id`
     * const tAccountWithT_idOnly = await prisma.tAccount.createManyAndReturn({
     *   select: { t_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, TAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TAccount.
     * @param {TAccountDeleteArgs} args - Arguments to delete one TAccount.
     * @example
     * // Delete one TAccount
     * const TAccount = await prisma.tAccount.delete({
     *   where: {
     *     // ... filter to delete one TAccount
     *   }
     * })
     * 
     */
    delete<T extends TAccountDeleteArgs>(args: SelectSubset<T, TAccountDeleteArgs<ExtArgs>>): Prisma__TAccountClient<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TAccount.
     * @param {TAccountUpdateArgs} args - Arguments to update one TAccount.
     * @example
     * // Update one TAccount
     * const tAccount = await prisma.tAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TAccountUpdateArgs>(args: SelectSubset<T, TAccountUpdateArgs<ExtArgs>>): Prisma__TAccountClient<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TAccounts.
     * @param {TAccountDeleteManyArgs} args - Arguments to filter TAccounts to delete.
     * @example
     * // Delete a few TAccounts
     * const { count } = await prisma.tAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TAccountDeleteManyArgs>(args?: SelectSubset<T, TAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TAccounts
     * const tAccount = await prisma.tAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TAccountUpdateManyArgs>(args: SelectSubset<T, TAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TAccounts and returns the data updated in the database.
     * @param {TAccountUpdateManyAndReturnArgs} args - Arguments to update many TAccounts.
     * @example
     * // Update many TAccounts
     * const tAccount = await prisma.tAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TAccounts and only return the `t_id`
     * const tAccountWithT_idOnly = await prisma.tAccount.updateManyAndReturn({
     *   select: { t_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, TAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TAccount.
     * @param {TAccountUpsertArgs} args - Arguments to update or create a TAccount.
     * @example
     * // Update or create a TAccount
     * const tAccount = await prisma.tAccount.upsert({
     *   create: {
     *     // ... data to create a TAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TAccount we want to update
     *   }
     * })
     */
    upsert<T extends TAccountUpsertArgs>(args: SelectSubset<T, TAccountUpsertArgs<ExtArgs>>): Prisma__TAccountClient<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TAccountCountArgs} args - Arguments to filter TAccounts to count.
     * @example
     * // Count the number of TAccounts
     * const count = await prisma.tAccount.count({
     *   where: {
     *     // ... the filter for the TAccounts we want to count
     *   }
     * })
    **/
    count<T extends TAccountCountArgs>(
      args?: Subset<T, TAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TAccountAggregateArgs>(args: Subset<T, TAccountAggregateArgs>): Prisma.PrismaPromise<GetTAccountAggregateType<T>>

    /**
     * Group by TAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TAccountGroupByArgs['orderBy'] }
        : { orderBy?: TAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TAccount model
   */
  readonly fields: TAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auth<T extends AuthDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthDefaultArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    specs<T extends TAccount$specsArgs<ExtArgs> = {}>(args?: Subset<T, TAccount$specsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpecializationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    classes<T extends TAccount$classesArgs<ExtArgs> = {}>(args?: Subset<T, TAccount$classesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TAccount model
   */
  interface TAccountFieldRefs {
    readonly t_id: FieldRef<"TAccount", 'Int'>
    readonly auth_id: FieldRef<"TAccount", 'Int'>
    readonly name: FieldRef<"TAccount", 'String'>
    readonly bio: FieldRef<"TAccount", 'String'>
    readonly rating: FieldRef<"TAccount", 'Float'>
    readonly updated_at: FieldRef<"TAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TAccount findUnique
   */
  export type TAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
    /**
     * Filter, which TAccount to fetch.
     */
    where: TAccountWhereUniqueInput
  }

  /**
   * TAccount findUniqueOrThrow
   */
  export type TAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
    /**
     * Filter, which TAccount to fetch.
     */
    where: TAccountWhereUniqueInput
  }

  /**
   * TAccount findFirst
   */
  export type TAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
    /**
     * Filter, which TAccount to fetch.
     */
    where?: TAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TAccounts to fetch.
     */
    orderBy?: TAccountOrderByWithRelationInput | TAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TAccounts.
     */
    cursor?: TAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TAccounts.
     */
    distinct?: TAccountScalarFieldEnum | TAccountScalarFieldEnum[]
  }

  /**
   * TAccount findFirstOrThrow
   */
  export type TAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
    /**
     * Filter, which TAccount to fetch.
     */
    where?: TAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TAccounts to fetch.
     */
    orderBy?: TAccountOrderByWithRelationInput | TAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TAccounts.
     */
    cursor?: TAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TAccounts.
     */
    distinct?: TAccountScalarFieldEnum | TAccountScalarFieldEnum[]
  }

  /**
   * TAccount findMany
   */
  export type TAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
    /**
     * Filter, which TAccounts to fetch.
     */
    where?: TAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TAccounts to fetch.
     */
    orderBy?: TAccountOrderByWithRelationInput | TAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TAccounts.
     */
    cursor?: TAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TAccounts.
     */
    skip?: number
    distinct?: TAccountScalarFieldEnum | TAccountScalarFieldEnum[]
  }

  /**
   * TAccount create
   */
  export type TAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a TAccount.
     */
    data: XOR<TAccountCreateInput, TAccountUncheckedCreateInput>
  }

  /**
   * TAccount createMany
   */
  export type TAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TAccounts.
     */
    data: TAccountCreateManyInput | TAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TAccount createManyAndReturn
   */
  export type TAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * The data used to create many TAccounts.
     */
    data: TAccountCreateManyInput | TAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TAccount update
   */
  export type TAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a TAccount.
     */
    data: XOR<TAccountUpdateInput, TAccountUncheckedUpdateInput>
    /**
     * Choose, which TAccount to update.
     */
    where: TAccountWhereUniqueInput
  }

  /**
   * TAccount updateMany
   */
  export type TAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TAccounts.
     */
    data: XOR<TAccountUpdateManyMutationInput, TAccountUncheckedUpdateManyInput>
    /**
     * Filter which TAccounts to update
     */
    where?: TAccountWhereInput
    /**
     * Limit how many TAccounts to update.
     */
    limit?: number
  }

  /**
   * TAccount updateManyAndReturn
   */
  export type TAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * The data used to update TAccounts.
     */
    data: XOR<TAccountUpdateManyMutationInput, TAccountUncheckedUpdateManyInput>
    /**
     * Filter which TAccounts to update
     */
    where?: TAccountWhereInput
    /**
     * Limit how many TAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TAccount upsert
   */
  export type TAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the TAccount to update in case it exists.
     */
    where: TAccountWhereUniqueInput
    /**
     * In case the TAccount found by the `where` argument doesn't exist, create a new TAccount with this data.
     */
    create: XOR<TAccountCreateInput, TAccountUncheckedCreateInput>
    /**
     * In case the TAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TAccountUpdateInput, TAccountUncheckedUpdateInput>
  }

  /**
   * TAccount delete
   */
  export type TAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
    /**
     * Filter which TAccount to delete.
     */
    where: TAccountWhereUniqueInput
  }

  /**
   * TAccount deleteMany
   */
  export type TAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TAccounts to delete
     */
    where?: TAccountWhereInput
    /**
     * Limit how many TAccounts to delete.
     */
    limit?: number
  }

  /**
   * TAccount.specs
   */
  export type TAccount$specsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialization
     */
    select?: SpecializationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Specialization
     */
    omit?: SpecializationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpecializationInclude<ExtArgs> | null
    where?: SpecializationWhereInput
    orderBy?: SpecializationOrderByWithRelationInput | SpecializationOrderByWithRelationInput[]
    cursor?: SpecializationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpecializationScalarFieldEnum | SpecializationScalarFieldEnum[]
  }

  /**
   * TAccount.classes
   */
  export type TAccount$classesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    where?: ClassRecordWhereInput
    orderBy?: ClassRecordOrderByWithRelationInput | ClassRecordOrderByWithRelationInput[]
    cursor?: ClassRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClassRecordScalarFieldEnum | ClassRecordScalarFieldEnum[]
  }

  /**
   * TAccount without action
   */
  export type TAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TAccount
     */
    select?: TAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TAccount
     */
    omit?: TAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TAccountInclude<ExtArgs> | null
  }


  /**
   * Model PlanDesc
   */

  export type AggregatePlanDesc = {
    _count: PlanDescCountAggregateOutputType | null
    _avg: PlanDescAvgAggregateOutputType | null
    _sum: PlanDescSumAggregateOutputType | null
    _min: PlanDescMinAggregateOutputType | null
    _max: PlanDescMaxAggregateOutputType | null
  }

  export type PlanDescAvgAggregateOutputType = {
    plan_id: number | null
    duration: number | null
    price: number | null
    sessionsIncluded: number | null
  }

  export type PlanDescSumAggregateOutputType = {
    plan_id: number | null
    duration: number | null
    price: number | null
    sessionsIncluded: number | null
  }

  export type PlanDescMinAggregateOutputType = {
    plan_id: number | null
    plan_name: string | null
    desc: string | null
    duration: number | null
    price: number | null
    sessionsIncluded: number | null
  }

  export type PlanDescMaxAggregateOutputType = {
    plan_id: number | null
    plan_name: string | null
    desc: string | null
    duration: number | null
    price: number | null
    sessionsIncluded: number | null
  }

  export type PlanDescCountAggregateOutputType = {
    plan_id: number
    plan_name: number
    desc: number
    duration: number
    price: number
    sessionsIncluded: number
    _all: number
  }


  export type PlanDescAvgAggregateInputType = {
    plan_id?: true
    duration?: true
    price?: true
    sessionsIncluded?: true
  }

  export type PlanDescSumAggregateInputType = {
    plan_id?: true
    duration?: true
    price?: true
    sessionsIncluded?: true
  }

  export type PlanDescMinAggregateInputType = {
    plan_id?: true
    plan_name?: true
    desc?: true
    duration?: true
    price?: true
    sessionsIncluded?: true
  }

  export type PlanDescMaxAggregateInputType = {
    plan_id?: true
    plan_name?: true
    desc?: true
    duration?: true
    price?: true
    sessionsIncluded?: true
  }

  export type PlanDescCountAggregateInputType = {
    plan_id?: true
    plan_name?: true
    desc?: true
    duration?: true
    price?: true
    sessionsIncluded?: true
    _all?: true
  }

  export type PlanDescAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlanDesc to aggregate.
     */
    where?: PlanDescWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanDescs to fetch.
     */
    orderBy?: PlanDescOrderByWithRelationInput | PlanDescOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlanDescWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanDescs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanDescs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlanDescs
    **/
    _count?: true | PlanDescCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlanDescAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlanDescSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanDescMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanDescMaxAggregateInputType
  }

  export type GetPlanDescAggregateType<T extends PlanDescAggregateArgs> = {
        [P in keyof T & keyof AggregatePlanDesc]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlanDesc[P]>
      : GetScalarType<T[P], AggregatePlanDesc[P]>
  }




  export type PlanDescGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanDescWhereInput
    orderBy?: PlanDescOrderByWithAggregationInput | PlanDescOrderByWithAggregationInput[]
    by: PlanDescScalarFieldEnum[] | PlanDescScalarFieldEnum
    having?: PlanDescScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanDescCountAggregateInputType | true
    _avg?: PlanDescAvgAggregateInputType
    _sum?: PlanDescSumAggregateInputType
    _min?: PlanDescMinAggregateInputType
    _max?: PlanDescMaxAggregateInputType
  }

  export type PlanDescGroupByOutputType = {
    plan_id: number
    plan_name: string
    desc: string | null
    duration: number
    price: number
    sessionsIncluded: number
    _count: PlanDescCountAggregateOutputType | null
    _avg: PlanDescAvgAggregateOutputType | null
    _sum: PlanDescSumAggregateOutputType | null
    _min: PlanDescMinAggregateOutputType | null
    _max: PlanDescMaxAggregateOutputType | null
  }

  type GetPlanDescGroupByPayload<T extends PlanDescGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlanDescGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanDescGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanDescGroupByOutputType[P]>
            : GetScalarType<T[P], PlanDescGroupByOutputType[P]>
        }
      >
    >


  export type PlanDescSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    plan_id?: boolean
    plan_name?: boolean
    desc?: boolean
    duration?: boolean
    price?: boolean
    sessionsIncluded?: boolean
    records?: boolean | PlanDesc$recordsArgs<ExtArgs>
    _count?: boolean | PlanDescCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["planDesc"]>

  export type PlanDescSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    plan_id?: boolean
    plan_name?: boolean
    desc?: boolean
    duration?: boolean
    price?: boolean
    sessionsIncluded?: boolean
  }, ExtArgs["result"]["planDesc"]>

  export type PlanDescSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    plan_id?: boolean
    plan_name?: boolean
    desc?: boolean
    duration?: boolean
    price?: boolean
    sessionsIncluded?: boolean
  }, ExtArgs["result"]["planDesc"]>

  export type PlanDescSelectScalar = {
    plan_id?: boolean
    plan_name?: boolean
    desc?: boolean
    duration?: boolean
    price?: boolean
    sessionsIncluded?: boolean
  }

  export type PlanDescOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"plan_id" | "plan_name" | "desc" | "duration" | "price" | "sessionsIncluded", ExtArgs["result"]["planDesc"]>
  export type PlanDescInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    records?: boolean | PlanDesc$recordsArgs<ExtArgs>
    _count?: boolean | PlanDescCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlanDescIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PlanDescIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PlanDescPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlanDesc"
    objects: {
      records: Prisma.$PlanRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      plan_id: number
      plan_name: string
      desc: string | null
      duration: number
      price: number
      sessionsIncluded: number
    }, ExtArgs["result"]["planDesc"]>
    composites: {}
  }

  type PlanDescGetPayload<S extends boolean | null | undefined | PlanDescDefaultArgs> = $Result.GetResult<Prisma.$PlanDescPayload, S>

  type PlanDescCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlanDescFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlanDescCountAggregateInputType | true
    }

  export interface PlanDescDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlanDesc'], meta: { name: 'PlanDesc' } }
    /**
     * Find zero or one PlanDesc that matches the filter.
     * @param {PlanDescFindUniqueArgs} args - Arguments to find a PlanDesc
     * @example
     * // Get one PlanDesc
     * const planDesc = await prisma.planDesc.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlanDescFindUniqueArgs>(args: SelectSubset<T, PlanDescFindUniqueArgs<ExtArgs>>): Prisma__PlanDescClient<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlanDesc that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlanDescFindUniqueOrThrowArgs} args - Arguments to find a PlanDesc
     * @example
     * // Get one PlanDesc
     * const planDesc = await prisma.planDesc.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlanDescFindUniqueOrThrowArgs>(args: SelectSubset<T, PlanDescFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlanDescClient<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlanDesc that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanDescFindFirstArgs} args - Arguments to find a PlanDesc
     * @example
     * // Get one PlanDesc
     * const planDesc = await prisma.planDesc.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlanDescFindFirstArgs>(args?: SelectSubset<T, PlanDescFindFirstArgs<ExtArgs>>): Prisma__PlanDescClient<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlanDesc that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanDescFindFirstOrThrowArgs} args - Arguments to find a PlanDesc
     * @example
     * // Get one PlanDesc
     * const planDesc = await prisma.planDesc.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlanDescFindFirstOrThrowArgs>(args?: SelectSubset<T, PlanDescFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlanDescClient<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlanDescs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanDescFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlanDescs
     * const planDescs = await prisma.planDesc.findMany()
     * 
     * // Get first 10 PlanDescs
     * const planDescs = await prisma.planDesc.findMany({ take: 10 })
     * 
     * // Only select the `plan_id`
     * const planDescWithPlan_idOnly = await prisma.planDesc.findMany({ select: { plan_id: true } })
     * 
     */
    findMany<T extends PlanDescFindManyArgs>(args?: SelectSubset<T, PlanDescFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlanDesc.
     * @param {PlanDescCreateArgs} args - Arguments to create a PlanDesc.
     * @example
     * // Create one PlanDesc
     * const PlanDesc = await prisma.planDesc.create({
     *   data: {
     *     // ... data to create a PlanDesc
     *   }
     * })
     * 
     */
    create<T extends PlanDescCreateArgs>(args: SelectSubset<T, PlanDescCreateArgs<ExtArgs>>): Prisma__PlanDescClient<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlanDescs.
     * @param {PlanDescCreateManyArgs} args - Arguments to create many PlanDescs.
     * @example
     * // Create many PlanDescs
     * const planDesc = await prisma.planDesc.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlanDescCreateManyArgs>(args?: SelectSubset<T, PlanDescCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PlanDescs and returns the data saved in the database.
     * @param {PlanDescCreateManyAndReturnArgs} args - Arguments to create many PlanDescs.
     * @example
     * // Create many PlanDescs
     * const planDesc = await prisma.planDesc.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PlanDescs and only return the `plan_id`
     * const planDescWithPlan_idOnly = await prisma.planDesc.createManyAndReturn({
     *   select: { plan_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlanDescCreateManyAndReturnArgs>(args?: SelectSubset<T, PlanDescCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PlanDesc.
     * @param {PlanDescDeleteArgs} args - Arguments to delete one PlanDesc.
     * @example
     * // Delete one PlanDesc
     * const PlanDesc = await prisma.planDesc.delete({
     *   where: {
     *     // ... filter to delete one PlanDesc
     *   }
     * })
     * 
     */
    delete<T extends PlanDescDeleteArgs>(args: SelectSubset<T, PlanDescDeleteArgs<ExtArgs>>): Prisma__PlanDescClient<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlanDesc.
     * @param {PlanDescUpdateArgs} args - Arguments to update one PlanDesc.
     * @example
     * // Update one PlanDesc
     * const planDesc = await prisma.planDesc.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlanDescUpdateArgs>(args: SelectSubset<T, PlanDescUpdateArgs<ExtArgs>>): Prisma__PlanDescClient<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlanDescs.
     * @param {PlanDescDeleteManyArgs} args - Arguments to filter PlanDescs to delete.
     * @example
     * // Delete a few PlanDescs
     * const { count } = await prisma.planDesc.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlanDescDeleteManyArgs>(args?: SelectSubset<T, PlanDescDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlanDescs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanDescUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlanDescs
     * const planDesc = await prisma.planDesc.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlanDescUpdateManyArgs>(args: SelectSubset<T, PlanDescUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlanDescs and returns the data updated in the database.
     * @param {PlanDescUpdateManyAndReturnArgs} args - Arguments to update many PlanDescs.
     * @example
     * // Update many PlanDescs
     * const planDesc = await prisma.planDesc.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PlanDescs and only return the `plan_id`
     * const planDescWithPlan_idOnly = await prisma.planDesc.updateManyAndReturn({
     *   select: { plan_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlanDescUpdateManyAndReturnArgs>(args: SelectSubset<T, PlanDescUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PlanDesc.
     * @param {PlanDescUpsertArgs} args - Arguments to update or create a PlanDesc.
     * @example
     * // Update or create a PlanDesc
     * const planDesc = await prisma.planDesc.upsert({
     *   create: {
     *     // ... data to create a PlanDesc
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlanDesc we want to update
     *   }
     * })
     */
    upsert<T extends PlanDescUpsertArgs>(args: SelectSubset<T, PlanDescUpsertArgs<ExtArgs>>): Prisma__PlanDescClient<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlanDescs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanDescCountArgs} args - Arguments to filter PlanDescs to count.
     * @example
     * // Count the number of PlanDescs
     * const count = await prisma.planDesc.count({
     *   where: {
     *     // ... the filter for the PlanDescs we want to count
     *   }
     * })
    **/
    count<T extends PlanDescCountArgs>(
      args?: Subset<T, PlanDescCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanDescCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlanDesc.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanDescAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlanDescAggregateArgs>(args: Subset<T, PlanDescAggregateArgs>): Prisma.PrismaPromise<GetPlanDescAggregateType<T>>

    /**
     * Group by PlanDesc.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanDescGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlanDescGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanDescGroupByArgs['orderBy'] }
        : { orderBy?: PlanDescGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanDescGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanDescGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlanDesc model
   */
  readonly fields: PlanDescFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlanDesc.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlanDescClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    records<T extends PlanDesc$recordsArgs<ExtArgs> = {}>(args?: Subset<T, PlanDesc$recordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlanDesc model
   */
  interface PlanDescFieldRefs {
    readonly plan_id: FieldRef<"PlanDesc", 'Int'>
    readonly plan_name: FieldRef<"PlanDesc", 'String'>
    readonly desc: FieldRef<"PlanDesc", 'String'>
    readonly duration: FieldRef<"PlanDesc", 'Int'>
    readonly price: FieldRef<"PlanDesc", 'Float'>
    readonly sessionsIncluded: FieldRef<"PlanDesc", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * PlanDesc findUnique
   */
  export type PlanDescFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanDescInclude<ExtArgs> | null
    /**
     * Filter, which PlanDesc to fetch.
     */
    where: PlanDescWhereUniqueInput
  }

  /**
   * PlanDesc findUniqueOrThrow
   */
  export type PlanDescFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanDescInclude<ExtArgs> | null
    /**
     * Filter, which PlanDesc to fetch.
     */
    where: PlanDescWhereUniqueInput
  }

  /**
   * PlanDesc findFirst
   */
  export type PlanDescFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanDescInclude<ExtArgs> | null
    /**
     * Filter, which PlanDesc to fetch.
     */
    where?: PlanDescWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanDescs to fetch.
     */
    orderBy?: PlanDescOrderByWithRelationInput | PlanDescOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlanDescs.
     */
    cursor?: PlanDescWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanDescs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanDescs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlanDescs.
     */
    distinct?: PlanDescScalarFieldEnum | PlanDescScalarFieldEnum[]
  }

  /**
   * PlanDesc findFirstOrThrow
   */
  export type PlanDescFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanDescInclude<ExtArgs> | null
    /**
     * Filter, which PlanDesc to fetch.
     */
    where?: PlanDescWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanDescs to fetch.
     */
    orderBy?: PlanDescOrderByWithRelationInput | PlanDescOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlanDescs.
     */
    cursor?: PlanDescWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanDescs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanDescs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlanDescs.
     */
    distinct?: PlanDescScalarFieldEnum | PlanDescScalarFieldEnum[]
  }

  /**
   * PlanDesc findMany
   */
  export type PlanDescFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanDescInclude<ExtArgs> | null
    /**
     * Filter, which PlanDescs to fetch.
     */
    where?: PlanDescWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanDescs to fetch.
     */
    orderBy?: PlanDescOrderByWithRelationInput | PlanDescOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlanDescs.
     */
    cursor?: PlanDescWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanDescs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanDescs.
     */
    skip?: number
    distinct?: PlanDescScalarFieldEnum | PlanDescScalarFieldEnum[]
  }

  /**
   * PlanDesc create
   */
  export type PlanDescCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanDescInclude<ExtArgs> | null
    /**
     * The data needed to create a PlanDesc.
     */
    data: XOR<PlanDescCreateInput, PlanDescUncheckedCreateInput>
  }

  /**
   * PlanDesc createMany
   */
  export type PlanDescCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlanDescs.
     */
    data: PlanDescCreateManyInput | PlanDescCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlanDesc createManyAndReturn
   */
  export type PlanDescCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * The data used to create many PlanDescs.
     */
    data: PlanDescCreateManyInput | PlanDescCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlanDesc update
   */
  export type PlanDescUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanDescInclude<ExtArgs> | null
    /**
     * The data needed to update a PlanDesc.
     */
    data: XOR<PlanDescUpdateInput, PlanDescUncheckedUpdateInput>
    /**
     * Choose, which PlanDesc to update.
     */
    where: PlanDescWhereUniqueInput
  }

  /**
   * PlanDesc updateMany
   */
  export type PlanDescUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlanDescs.
     */
    data: XOR<PlanDescUpdateManyMutationInput, PlanDescUncheckedUpdateManyInput>
    /**
     * Filter which PlanDescs to update
     */
    where?: PlanDescWhereInput
    /**
     * Limit how many PlanDescs to update.
     */
    limit?: number
  }

  /**
   * PlanDesc updateManyAndReturn
   */
  export type PlanDescUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * The data used to update PlanDescs.
     */
    data: XOR<PlanDescUpdateManyMutationInput, PlanDescUncheckedUpdateManyInput>
    /**
     * Filter which PlanDescs to update
     */
    where?: PlanDescWhereInput
    /**
     * Limit how many PlanDescs to update.
     */
    limit?: number
  }

  /**
   * PlanDesc upsert
   */
  export type PlanDescUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanDescInclude<ExtArgs> | null
    /**
     * The filter to search for the PlanDesc to update in case it exists.
     */
    where: PlanDescWhereUniqueInput
    /**
     * In case the PlanDesc found by the `where` argument doesn't exist, create a new PlanDesc with this data.
     */
    create: XOR<PlanDescCreateInput, PlanDescUncheckedCreateInput>
    /**
     * In case the PlanDesc was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlanDescUpdateInput, PlanDescUncheckedUpdateInput>
  }

  /**
   * PlanDesc delete
   */
  export type PlanDescDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanDescInclude<ExtArgs> | null
    /**
     * Filter which PlanDesc to delete.
     */
    where: PlanDescWhereUniqueInput
  }

  /**
   * PlanDesc deleteMany
   */
  export type PlanDescDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlanDescs to delete
     */
    where?: PlanDescWhereInput
    /**
     * Limit how many PlanDescs to delete.
     */
    limit?: number
  }

  /**
   * PlanDesc.records
   */
  export type PlanDesc$recordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
    where?: PlanRecordWhereInput
    orderBy?: PlanRecordOrderByWithRelationInput | PlanRecordOrderByWithRelationInput[]
    cursor?: PlanRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlanRecordScalarFieldEnum | PlanRecordScalarFieldEnum[]
  }

  /**
   * PlanDesc without action
   */
  export type PlanDescDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanDesc
     */
    select?: PlanDescSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanDesc
     */
    omit?: PlanDescOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanDescInclude<ExtArgs> | null
  }


  /**
   * Model PlanRecord
   */

  export type AggregatePlanRecord = {
    _count: PlanRecordCountAggregateOutputType | null
    _avg: PlanRecordAvgAggregateOutputType | null
    _sum: PlanRecordSumAggregateOutputType | null
    _min: PlanRecordMinAggregateOutputType | null
    _max: PlanRecordMaxAggregateOutputType | null
  }

  export type PlanRecordAvgAggregateOutputType = {
    record_no: number | null
    s_id: number | null
    plan_id: number | null
    sessionsRem: number | null
  }

  export type PlanRecordSumAggregateOutputType = {
    record_no: number | null
    s_id: number | null
    plan_id: number | null
    sessionsRem: number | null
  }

  export type PlanRecordMinAggregateOutputType = {
    record_no: number | null
    s_id: number | null
    plan_id: number | null
    joinAt: Date | null
    sessionsRem: number | null
    isValid: boolean | null
  }

  export type PlanRecordMaxAggregateOutputType = {
    record_no: number | null
    s_id: number | null
    plan_id: number | null
    joinAt: Date | null
    sessionsRem: number | null
    isValid: boolean | null
  }

  export type PlanRecordCountAggregateOutputType = {
    record_no: number
    s_id: number
    plan_id: number
    joinAt: number
    sessionsRem: number
    isValid: number
    _all: number
  }


  export type PlanRecordAvgAggregateInputType = {
    record_no?: true
    s_id?: true
    plan_id?: true
    sessionsRem?: true
  }

  export type PlanRecordSumAggregateInputType = {
    record_no?: true
    s_id?: true
    plan_id?: true
    sessionsRem?: true
  }

  export type PlanRecordMinAggregateInputType = {
    record_no?: true
    s_id?: true
    plan_id?: true
    joinAt?: true
    sessionsRem?: true
    isValid?: true
  }

  export type PlanRecordMaxAggregateInputType = {
    record_no?: true
    s_id?: true
    plan_id?: true
    joinAt?: true
    sessionsRem?: true
    isValid?: true
  }

  export type PlanRecordCountAggregateInputType = {
    record_no?: true
    s_id?: true
    plan_id?: true
    joinAt?: true
    sessionsRem?: true
    isValid?: true
    _all?: true
  }

  export type PlanRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlanRecord to aggregate.
     */
    where?: PlanRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanRecords to fetch.
     */
    orderBy?: PlanRecordOrderByWithRelationInput | PlanRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlanRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlanRecords
    **/
    _count?: true | PlanRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlanRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlanRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanRecordMaxAggregateInputType
  }

  export type GetPlanRecordAggregateType<T extends PlanRecordAggregateArgs> = {
        [P in keyof T & keyof AggregatePlanRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlanRecord[P]>
      : GetScalarType<T[P], AggregatePlanRecord[P]>
  }




  export type PlanRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanRecordWhereInput
    orderBy?: PlanRecordOrderByWithAggregationInput | PlanRecordOrderByWithAggregationInput[]
    by: PlanRecordScalarFieldEnum[] | PlanRecordScalarFieldEnum
    having?: PlanRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanRecordCountAggregateInputType | true
    _avg?: PlanRecordAvgAggregateInputType
    _sum?: PlanRecordSumAggregateInputType
    _min?: PlanRecordMinAggregateInputType
    _max?: PlanRecordMaxAggregateInputType
  }

  export type PlanRecordGroupByOutputType = {
    record_no: number
    s_id: number
    plan_id: number
    joinAt: Date
    sessionsRem: number
    isValid: boolean
    _count: PlanRecordCountAggregateOutputType | null
    _avg: PlanRecordAvgAggregateOutputType | null
    _sum: PlanRecordSumAggregateOutputType | null
    _min: PlanRecordMinAggregateOutputType | null
    _max: PlanRecordMaxAggregateOutputType | null
  }

  type GetPlanRecordGroupByPayload<T extends PlanRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlanRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanRecordGroupByOutputType[P]>
            : GetScalarType<T[P], PlanRecordGroupByOutputType[P]>
        }
      >
    >


  export type PlanRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    record_no?: boolean
    s_id?: boolean
    plan_id?: boolean
    joinAt?: boolean
    sessionsRem?: boolean
    isValid?: boolean
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    plan?: boolean | PlanDescDefaultArgs<ExtArgs>
    classes?: boolean | PlanRecord$classesArgs<ExtArgs>
    _count?: boolean | PlanRecordCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["planRecord"]>

  export type PlanRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    record_no?: boolean
    s_id?: boolean
    plan_id?: boolean
    joinAt?: boolean
    sessionsRem?: boolean
    isValid?: boolean
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    plan?: boolean | PlanDescDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["planRecord"]>

  export type PlanRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    record_no?: boolean
    s_id?: boolean
    plan_id?: boolean
    joinAt?: boolean
    sessionsRem?: boolean
    isValid?: boolean
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    plan?: boolean | PlanDescDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["planRecord"]>

  export type PlanRecordSelectScalar = {
    record_no?: boolean
    s_id?: boolean
    plan_id?: boolean
    joinAt?: boolean
    sessionsRem?: boolean
    isValid?: boolean
  }

  export type PlanRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"record_no" | "s_id" | "plan_id" | "joinAt" | "sessionsRem" | "isValid", ExtArgs["result"]["planRecord"]>
  export type PlanRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    plan?: boolean | PlanDescDefaultArgs<ExtArgs>
    classes?: boolean | PlanRecord$classesArgs<ExtArgs>
    _count?: boolean | PlanRecordCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlanRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    plan?: boolean | PlanDescDefaultArgs<ExtArgs>
  }
  export type PlanRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    plan?: boolean | PlanDescDefaultArgs<ExtArgs>
  }

  export type $PlanRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlanRecord"
    objects: {
      student: Prisma.$StAccountPayload<ExtArgs>
      plan: Prisma.$PlanDescPayload<ExtArgs>
      classes: Prisma.$ClassRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      record_no: number
      s_id: number
      plan_id: number
      joinAt: Date
      sessionsRem: number
      isValid: boolean
    }, ExtArgs["result"]["planRecord"]>
    composites: {}
  }

  type PlanRecordGetPayload<S extends boolean | null | undefined | PlanRecordDefaultArgs> = $Result.GetResult<Prisma.$PlanRecordPayload, S>

  type PlanRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlanRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlanRecordCountAggregateInputType | true
    }

  export interface PlanRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlanRecord'], meta: { name: 'PlanRecord' } }
    /**
     * Find zero or one PlanRecord that matches the filter.
     * @param {PlanRecordFindUniqueArgs} args - Arguments to find a PlanRecord
     * @example
     * // Get one PlanRecord
     * const planRecord = await prisma.planRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlanRecordFindUniqueArgs>(args: SelectSubset<T, PlanRecordFindUniqueArgs<ExtArgs>>): Prisma__PlanRecordClient<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlanRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlanRecordFindUniqueOrThrowArgs} args - Arguments to find a PlanRecord
     * @example
     * // Get one PlanRecord
     * const planRecord = await prisma.planRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlanRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, PlanRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlanRecordClient<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlanRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanRecordFindFirstArgs} args - Arguments to find a PlanRecord
     * @example
     * // Get one PlanRecord
     * const planRecord = await prisma.planRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlanRecordFindFirstArgs>(args?: SelectSubset<T, PlanRecordFindFirstArgs<ExtArgs>>): Prisma__PlanRecordClient<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlanRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanRecordFindFirstOrThrowArgs} args - Arguments to find a PlanRecord
     * @example
     * // Get one PlanRecord
     * const planRecord = await prisma.planRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlanRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, PlanRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlanRecordClient<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlanRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlanRecords
     * const planRecords = await prisma.planRecord.findMany()
     * 
     * // Get first 10 PlanRecords
     * const planRecords = await prisma.planRecord.findMany({ take: 10 })
     * 
     * // Only select the `record_no`
     * const planRecordWithRecord_noOnly = await prisma.planRecord.findMany({ select: { record_no: true } })
     * 
     */
    findMany<T extends PlanRecordFindManyArgs>(args?: SelectSubset<T, PlanRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlanRecord.
     * @param {PlanRecordCreateArgs} args - Arguments to create a PlanRecord.
     * @example
     * // Create one PlanRecord
     * const PlanRecord = await prisma.planRecord.create({
     *   data: {
     *     // ... data to create a PlanRecord
     *   }
     * })
     * 
     */
    create<T extends PlanRecordCreateArgs>(args: SelectSubset<T, PlanRecordCreateArgs<ExtArgs>>): Prisma__PlanRecordClient<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlanRecords.
     * @param {PlanRecordCreateManyArgs} args - Arguments to create many PlanRecords.
     * @example
     * // Create many PlanRecords
     * const planRecord = await prisma.planRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlanRecordCreateManyArgs>(args?: SelectSubset<T, PlanRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PlanRecords and returns the data saved in the database.
     * @param {PlanRecordCreateManyAndReturnArgs} args - Arguments to create many PlanRecords.
     * @example
     * // Create many PlanRecords
     * const planRecord = await prisma.planRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PlanRecords and only return the `record_no`
     * const planRecordWithRecord_noOnly = await prisma.planRecord.createManyAndReturn({
     *   select: { record_no: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlanRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, PlanRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PlanRecord.
     * @param {PlanRecordDeleteArgs} args - Arguments to delete one PlanRecord.
     * @example
     * // Delete one PlanRecord
     * const PlanRecord = await prisma.planRecord.delete({
     *   where: {
     *     // ... filter to delete one PlanRecord
     *   }
     * })
     * 
     */
    delete<T extends PlanRecordDeleteArgs>(args: SelectSubset<T, PlanRecordDeleteArgs<ExtArgs>>): Prisma__PlanRecordClient<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlanRecord.
     * @param {PlanRecordUpdateArgs} args - Arguments to update one PlanRecord.
     * @example
     * // Update one PlanRecord
     * const planRecord = await prisma.planRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlanRecordUpdateArgs>(args: SelectSubset<T, PlanRecordUpdateArgs<ExtArgs>>): Prisma__PlanRecordClient<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlanRecords.
     * @param {PlanRecordDeleteManyArgs} args - Arguments to filter PlanRecords to delete.
     * @example
     * // Delete a few PlanRecords
     * const { count } = await prisma.planRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlanRecordDeleteManyArgs>(args?: SelectSubset<T, PlanRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlanRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlanRecords
     * const planRecord = await prisma.planRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlanRecordUpdateManyArgs>(args: SelectSubset<T, PlanRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlanRecords and returns the data updated in the database.
     * @param {PlanRecordUpdateManyAndReturnArgs} args - Arguments to update many PlanRecords.
     * @example
     * // Update many PlanRecords
     * const planRecord = await prisma.planRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PlanRecords and only return the `record_no`
     * const planRecordWithRecord_noOnly = await prisma.planRecord.updateManyAndReturn({
     *   select: { record_no: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlanRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, PlanRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PlanRecord.
     * @param {PlanRecordUpsertArgs} args - Arguments to update or create a PlanRecord.
     * @example
     * // Update or create a PlanRecord
     * const planRecord = await prisma.planRecord.upsert({
     *   create: {
     *     // ... data to create a PlanRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlanRecord we want to update
     *   }
     * })
     */
    upsert<T extends PlanRecordUpsertArgs>(args: SelectSubset<T, PlanRecordUpsertArgs<ExtArgs>>): Prisma__PlanRecordClient<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlanRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanRecordCountArgs} args - Arguments to filter PlanRecords to count.
     * @example
     * // Count the number of PlanRecords
     * const count = await prisma.planRecord.count({
     *   where: {
     *     // ... the filter for the PlanRecords we want to count
     *   }
     * })
    **/
    count<T extends PlanRecordCountArgs>(
      args?: Subset<T, PlanRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlanRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlanRecordAggregateArgs>(args: Subset<T, PlanRecordAggregateArgs>): Prisma.PrismaPromise<GetPlanRecordAggregateType<T>>

    /**
     * Group by PlanRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlanRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanRecordGroupByArgs['orderBy'] }
        : { orderBy?: PlanRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlanRecord model
   */
  readonly fields: PlanRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlanRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlanRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StAccountDefaultArgs<ExtArgs>>): Prisma__StAccountClient<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    plan<T extends PlanDescDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlanDescDefaultArgs<ExtArgs>>): Prisma__PlanDescClient<$Result.GetResult<Prisma.$PlanDescPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    classes<T extends PlanRecord$classesArgs<ExtArgs> = {}>(args?: Subset<T, PlanRecord$classesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlanRecord model
   */
  interface PlanRecordFieldRefs {
    readonly record_no: FieldRef<"PlanRecord", 'Int'>
    readonly s_id: FieldRef<"PlanRecord", 'Int'>
    readonly plan_id: FieldRef<"PlanRecord", 'Int'>
    readonly joinAt: FieldRef<"PlanRecord", 'DateTime'>
    readonly sessionsRem: FieldRef<"PlanRecord", 'Int'>
    readonly isValid: FieldRef<"PlanRecord", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * PlanRecord findUnique
   */
  export type PlanRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
    /**
     * Filter, which PlanRecord to fetch.
     */
    where: PlanRecordWhereUniqueInput
  }

  /**
   * PlanRecord findUniqueOrThrow
   */
  export type PlanRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
    /**
     * Filter, which PlanRecord to fetch.
     */
    where: PlanRecordWhereUniqueInput
  }

  /**
   * PlanRecord findFirst
   */
  export type PlanRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
    /**
     * Filter, which PlanRecord to fetch.
     */
    where?: PlanRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanRecords to fetch.
     */
    orderBy?: PlanRecordOrderByWithRelationInput | PlanRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlanRecords.
     */
    cursor?: PlanRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlanRecords.
     */
    distinct?: PlanRecordScalarFieldEnum | PlanRecordScalarFieldEnum[]
  }

  /**
   * PlanRecord findFirstOrThrow
   */
  export type PlanRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
    /**
     * Filter, which PlanRecord to fetch.
     */
    where?: PlanRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanRecords to fetch.
     */
    orderBy?: PlanRecordOrderByWithRelationInput | PlanRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlanRecords.
     */
    cursor?: PlanRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlanRecords.
     */
    distinct?: PlanRecordScalarFieldEnum | PlanRecordScalarFieldEnum[]
  }

  /**
   * PlanRecord findMany
   */
  export type PlanRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
    /**
     * Filter, which PlanRecords to fetch.
     */
    where?: PlanRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanRecords to fetch.
     */
    orderBy?: PlanRecordOrderByWithRelationInput | PlanRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlanRecords.
     */
    cursor?: PlanRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanRecords.
     */
    skip?: number
    distinct?: PlanRecordScalarFieldEnum | PlanRecordScalarFieldEnum[]
  }

  /**
   * PlanRecord create
   */
  export type PlanRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a PlanRecord.
     */
    data: XOR<PlanRecordCreateInput, PlanRecordUncheckedCreateInput>
  }

  /**
   * PlanRecord createMany
   */
  export type PlanRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlanRecords.
     */
    data: PlanRecordCreateManyInput | PlanRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlanRecord createManyAndReturn
   */
  export type PlanRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * The data used to create many PlanRecords.
     */
    data: PlanRecordCreateManyInput | PlanRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlanRecord update
   */
  export type PlanRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a PlanRecord.
     */
    data: XOR<PlanRecordUpdateInput, PlanRecordUncheckedUpdateInput>
    /**
     * Choose, which PlanRecord to update.
     */
    where: PlanRecordWhereUniqueInput
  }

  /**
   * PlanRecord updateMany
   */
  export type PlanRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlanRecords.
     */
    data: XOR<PlanRecordUpdateManyMutationInput, PlanRecordUncheckedUpdateManyInput>
    /**
     * Filter which PlanRecords to update
     */
    where?: PlanRecordWhereInput
    /**
     * Limit how many PlanRecords to update.
     */
    limit?: number
  }

  /**
   * PlanRecord updateManyAndReturn
   */
  export type PlanRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * The data used to update PlanRecords.
     */
    data: XOR<PlanRecordUpdateManyMutationInput, PlanRecordUncheckedUpdateManyInput>
    /**
     * Filter which PlanRecords to update
     */
    where?: PlanRecordWhereInput
    /**
     * Limit how many PlanRecords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlanRecord upsert
   */
  export type PlanRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the PlanRecord to update in case it exists.
     */
    where: PlanRecordWhereUniqueInput
    /**
     * In case the PlanRecord found by the `where` argument doesn't exist, create a new PlanRecord with this data.
     */
    create: XOR<PlanRecordCreateInput, PlanRecordUncheckedCreateInput>
    /**
     * In case the PlanRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlanRecordUpdateInput, PlanRecordUncheckedUpdateInput>
  }

  /**
   * PlanRecord delete
   */
  export type PlanRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
    /**
     * Filter which PlanRecord to delete.
     */
    where: PlanRecordWhereUniqueInput
  }

  /**
   * PlanRecord deleteMany
   */
  export type PlanRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlanRecords to delete
     */
    where?: PlanRecordWhereInput
    /**
     * Limit how many PlanRecords to delete.
     */
    limit?: number
  }

  /**
   * PlanRecord.classes
   */
  export type PlanRecord$classesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    where?: ClassRecordWhereInput
    orderBy?: ClassRecordOrderByWithRelationInput | ClassRecordOrderByWithRelationInput[]
    cursor?: ClassRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClassRecordScalarFieldEnum | ClassRecordScalarFieldEnum[]
  }

  /**
   * PlanRecord without action
   */
  export type PlanRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanRecord
     */
    select?: PlanRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanRecord
     */
    omit?: PlanRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanRecordInclude<ExtArgs> | null
  }


  /**
   * Model ClassRecord
   */

  export type AggregateClassRecord = {
    _count: ClassRecordCountAggregateOutputType | null
    _avg: ClassRecordAvgAggregateOutputType | null
    _sum: ClassRecordSumAggregateOutputType | null
    _min: ClassRecordMinAggregateOutputType | null
    _max: ClassRecordMaxAggregateOutputType | null
  }

  export type ClassRecordAvgAggregateOutputType = {
    record_no: number | null
    t_id: number | null
    s_id: number | null
    plan_record_id: number | null
  }

  export type ClassRecordSumAggregateOutputType = {
    record_no: number | null
    t_id: number | null
    s_id: number | null
    plan_record_id: number | null
  }

  export type ClassRecordMinAggregateOutputType = {
    record_no: number | null
    t_id: number | null
    s_id: number | null
    plan_record_id: number | null
    link: string | null
    startAt: Date | null
    endAt: Date | null
  }

  export type ClassRecordMaxAggregateOutputType = {
    record_no: number | null
    t_id: number | null
    s_id: number | null
    plan_record_id: number | null
    link: string | null
    startAt: Date | null
    endAt: Date | null
  }

  export type ClassRecordCountAggregateOutputType = {
    record_no: number
    t_id: number
    s_id: number
    plan_record_id: number
    link: number
    startAt: number
    endAt: number
    _all: number
  }


  export type ClassRecordAvgAggregateInputType = {
    record_no?: true
    t_id?: true
    s_id?: true
    plan_record_id?: true
  }

  export type ClassRecordSumAggregateInputType = {
    record_no?: true
    t_id?: true
    s_id?: true
    plan_record_id?: true
  }

  export type ClassRecordMinAggregateInputType = {
    record_no?: true
    t_id?: true
    s_id?: true
    plan_record_id?: true
    link?: true
    startAt?: true
    endAt?: true
  }

  export type ClassRecordMaxAggregateInputType = {
    record_no?: true
    t_id?: true
    s_id?: true
    plan_record_id?: true
    link?: true
    startAt?: true
    endAt?: true
  }

  export type ClassRecordCountAggregateInputType = {
    record_no?: true
    t_id?: true
    s_id?: true
    plan_record_id?: true
    link?: true
    startAt?: true
    endAt?: true
    _all?: true
  }

  export type ClassRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClassRecord to aggregate.
     */
    where?: ClassRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassRecords to fetch.
     */
    orderBy?: ClassRecordOrderByWithRelationInput | ClassRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClassRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClassRecords
    **/
    _count?: true | ClassRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClassRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClassRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClassRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClassRecordMaxAggregateInputType
  }

  export type GetClassRecordAggregateType<T extends ClassRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateClassRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClassRecord[P]>
      : GetScalarType<T[P], AggregateClassRecord[P]>
  }




  export type ClassRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassRecordWhereInput
    orderBy?: ClassRecordOrderByWithAggregationInput | ClassRecordOrderByWithAggregationInput[]
    by: ClassRecordScalarFieldEnum[] | ClassRecordScalarFieldEnum
    having?: ClassRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClassRecordCountAggregateInputType | true
    _avg?: ClassRecordAvgAggregateInputType
    _sum?: ClassRecordSumAggregateInputType
    _min?: ClassRecordMinAggregateInputType
    _max?: ClassRecordMaxAggregateInputType
  }

  export type ClassRecordGroupByOutputType = {
    record_no: number
    t_id: number
    s_id: number
    plan_record_id: number
    link: string | null
    startAt: Date
    endAt: Date | null
    _count: ClassRecordCountAggregateOutputType | null
    _avg: ClassRecordAvgAggregateOutputType | null
    _sum: ClassRecordSumAggregateOutputType | null
    _min: ClassRecordMinAggregateOutputType | null
    _max: ClassRecordMaxAggregateOutputType | null
  }

  type GetClassRecordGroupByPayload<T extends ClassRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClassRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClassRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClassRecordGroupByOutputType[P]>
            : GetScalarType<T[P], ClassRecordGroupByOutputType[P]>
        }
      >
    >


  export type ClassRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    record_no?: boolean
    t_id?: boolean
    s_id?: boolean
    plan_record_id?: boolean
    link?: boolean
    startAt?: boolean
    endAt?: boolean
    teacher?: boolean | TAccountDefaultArgs<ExtArgs>
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    planRecord?: boolean | PlanRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classRecord"]>

  export type ClassRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    record_no?: boolean
    t_id?: boolean
    s_id?: boolean
    plan_record_id?: boolean
    link?: boolean
    startAt?: boolean
    endAt?: boolean
    teacher?: boolean | TAccountDefaultArgs<ExtArgs>
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    planRecord?: boolean | PlanRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classRecord"]>

  export type ClassRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    record_no?: boolean
    t_id?: boolean
    s_id?: boolean
    plan_record_id?: boolean
    link?: boolean
    startAt?: boolean
    endAt?: boolean
    teacher?: boolean | TAccountDefaultArgs<ExtArgs>
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    planRecord?: boolean | PlanRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classRecord"]>

  export type ClassRecordSelectScalar = {
    record_no?: boolean
    t_id?: boolean
    s_id?: boolean
    plan_record_id?: boolean
    link?: boolean
    startAt?: boolean
    endAt?: boolean
  }

  export type ClassRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"record_no" | "t_id" | "s_id" | "plan_record_id" | "link" | "startAt" | "endAt", ExtArgs["result"]["classRecord"]>
  export type ClassRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    teacher?: boolean | TAccountDefaultArgs<ExtArgs>
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    planRecord?: boolean | PlanRecordDefaultArgs<ExtArgs>
  }
  export type ClassRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    teacher?: boolean | TAccountDefaultArgs<ExtArgs>
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    planRecord?: boolean | PlanRecordDefaultArgs<ExtArgs>
  }
  export type ClassRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    teacher?: boolean | TAccountDefaultArgs<ExtArgs>
    student?: boolean | StAccountDefaultArgs<ExtArgs>
    planRecord?: boolean | PlanRecordDefaultArgs<ExtArgs>
  }

  export type $ClassRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClassRecord"
    objects: {
      teacher: Prisma.$TAccountPayload<ExtArgs>
      student: Prisma.$StAccountPayload<ExtArgs>
      planRecord: Prisma.$PlanRecordPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      record_no: number
      t_id: number
      s_id: number
      plan_record_id: number
      link: string | null
      startAt: Date
      endAt: Date | null
    }, ExtArgs["result"]["classRecord"]>
    composites: {}
  }

  type ClassRecordGetPayload<S extends boolean | null | undefined | ClassRecordDefaultArgs> = $Result.GetResult<Prisma.$ClassRecordPayload, S>

  type ClassRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClassRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClassRecordCountAggregateInputType | true
    }

  export interface ClassRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClassRecord'], meta: { name: 'ClassRecord' } }
    /**
     * Find zero or one ClassRecord that matches the filter.
     * @param {ClassRecordFindUniqueArgs} args - Arguments to find a ClassRecord
     * @example
     * // Get one ClassRecord
     * const classRecord = await prisma.classRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClassRecordFindUniqueArgs>(args: SelectSubset<T, ClassRecordFindUniqueArgs<ExtArgs>>): Prisma__ClassRecordClient<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClassRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClassRecordFindUniqueOrThrowArgs} args - Arguments to find a ClassRecord
     * @example
     * // Get one ClassRecord
     * const classRecord = await prisma.classRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClassRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, ClassRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClassRecordClient<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClassRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRecordFindFirstArgs} args - Arguments to find a ClassRecord
     * @example
     * // Get one ClassRecord
     * const classRecord = await prisma.classRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClassRecordFindFirstArgs>(args?: SelectSubset<T, ClassRecordFindFirstArgs<ExtArgs>>): Prisma__ClassRecordClient<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClassRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRecordFindFirstOrThrowArgs} args - Arguments to find a ClassRecord
     * @example
     * // Get one ClassRecord
     * const classRecord = await prisma.classRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClassRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, ClassRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClassRecordClient<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClassRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClassRecords
     * const classRecords = await prisma.classRecord.findMany()
     * 
     * // Get first 10 ClassRecords
     * const classRecords = await prisma.classRecord.findMany({ take: 10 })
     * 
     * // Only select the `record_no`
     * const classRecordWithRecord_noOnly = await prisma.classRecord.findMany({ select: { record_no: true } })
     * 
     */
    findMany<T extends ClassRecordFindManyArgs>(args?: SelectSubset<T, ClassRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClassRecord.
     * @param {ClassRecordCreateArgs} args - Arguments to create a ClassRecord.
     * @example
     * // Create one ClassRecord
     * const ClassRecord = await prisma.classRecord.create({
     *   data: {
     *     // ... data to create a ClassRecord
     *   }
     * })
     * 
     */
    create<T extends ClassRecordCreateArgs>(args: SelectSubset<T, ClassRecordCreateArgs<ExtArgs>>): Prisma__ClassRecordClient<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClassRecords.
     * @param {ClassRecordCreateManyArgs} args - Arguments to create many ClassRecords.
     * @example
     * // Create many ClassRecords
     * const classRecord = await prisma.classRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClassRecordCreateManyArgs>(args?: SelectSubset<T, ClassRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClassRecords and returns the data saved in the database.
     * @param {ClassRecordCreateManyAndReturnArgs} args - Arguments to create many ClassRecords.
     * @example
     * // Create many ClassRecords
     * const classRecord = await prisma.classRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClassRecords and only return the `record_no`
     * const classRecordWithRecord_noOnly = await prisma.classRecord.createManyAndReturn({
     *   select: { record_no: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClassRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, ClassRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClassRecord.
     * @param {ClassRecordDeleteArgs} args - Arguments to delete one ClassRecord.
     * @example
     * // Delete one ClassRecord
     * const ClassRecord = await prisma.classRecord.delete({
     *   where: {
     *     // ... filter to delete one ClassRecord
     *   }
     * })
     * 
     */
    delete<T extends ClassRecordDeleteArgs>(args: SelectSubset<T, ClassRecordDeleteArgs<ExtArgs>>): Prisma__ClassRecordClient<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClassRecord.
     * @param {ClassRecordUpdateArgs} args - Arguments to update one ClassRecord.
     * @example
     * // Update one ClassRecord
     * const classRecord = await prisma.classRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClassRecordUpdateArgs>(args: SelectSubset<T, ClassRecordUpdateArgs<ExtArgs>>): Prisma__ClassRecordClient<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClassRecords.
     * @param {ClassRecordDeleteManyArgs} args - Arguments to filter ClassRecords to delete.
     * @example
     * // Delete a few ClassRecords
     * const { count } = await prisma.classRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClassRecordDeleteManyArgs>(args?: SelectSubset<T, ClassRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClassRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClassRecords
     * const classRecord = await prisma.classRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClassRecordUpdateManyArgs>(args: SelectSubset<T, ClassRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClassRecords and returns the data updated in the database.
     * @param {ClassRecordUpdateManyAndReturnArgs} args - Arguments to update many ClassRecords.
     * @example
     * // Update many ClassRecords
     * const classRecord = await prisma.classRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClassRecords and only return the `record_no`
     * const classRecordWithRecord_noOnly = await prisma.classRecord.updateManyAndReturn({
     *   select: { record_no: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClassRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, ClassRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClassRecord.
     * @param {ClassRecordUpsertArgs} args - Arguments to update or create a ClassRecord.
     * @example
     * // Update or create a ClassRecord
     * const classRecord = await prisma.classRecord.upsert({
     *   create: {
     *     // ... data to create a ClassRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClassRecord we want to update
     *   }
     * })
     */
    upsert<T extends ClassRecordUpsertArgs>(args: SelectSubset<T, ClassRecordUpsertArgs<ExtArgs>>): Prisma__ClassRecordClient<$Result.GetResult<Prisma.$ClassRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClassRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRecordCountArgs} args - Arguments to filter ClassRecords to count.
     * @example
     * // Count the number of ClassRecords
     * const count = await prisma.classRecord.count({
     *   where: {
     *     // ... the filter for the ClassRecords we want to count
     *   }
     * })
    **/
    count<T extends ClassRecordCountArgs>(
      args?: Subset<T, ClassRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClassRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClassRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClassRecordAggregateArgs>(args: Subset<T, ClassRecordAggregateArgs>): Prisma.PrismaPromise<GetClassRecordAggregateType<T>>

    /**
     * Group by ClassRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClassRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClassRecordGroupByArgs['orderBy'] }
        : { orderBy?: ClassRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClassRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClassRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClassRecord model
   */
  readonly fields: ClassRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClassRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClassRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    teacher<T extends TAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TAccountDefaultArgs<ExtArgs>>): Prisma__TAccountClient<$Result.GetResult<Prisma.$TAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    student<T extends StAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StAccountDefaultArgs<ExtArgs>>): Prisma__StAccountClient<$Result.GetResult<Prisma.$StAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    planRecord<T extends PlanRecordDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlanRecordDefaultArgs<ExtArgs>>): Prisma__PlanRecordClient<$Result.GetResult<Prisma.$PlanRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClassRecord model
   */
  interface ClassRecordFieldRefs {
    readonly record_no: FieldRef<"ClassRecord", 'Int'>
    readonly t_id: FieldRef<"ClassRecord", 'Int'>
    readonly s_id: FieldRef<"ClassRecord", 'Int'>
    readonly plan_record_id: FieldRef<"ClassRecord", 'Int'>
    readonly link: FieldRef<"ClassRecord", 'String'>
    readonly startAt: FieldRef<"ClassRecord", 'DateTime'>
    readonly endAt: FieldRef<"ClassRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClassRecord findUnique
   */
  export type ClassRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    /**
     * Filter, which ClassRecord to fetch.
     */
    where: ClassRecordWhereUniqueInput
  }

  /**
   * ClassRecord findUniqueOrThrow
   */
  export type ClassRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    /**
     * Filter, which ClassRecord to fetch.
     */
    where: ClassRecordWhereUniqueInput
  }

  /**
   * ClassRecord findFirst
   */
  export type ClassRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    /**
     * Filter, which ClassRecord to fetch.
     */
    where?: ClassRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassRecords to fetch.
     */
    orderBy?: ClassRecordOrderByWithRelationInput | ClassRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClassRecords.
     */
    cursor?: ClassRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClassRecords.
     */
    distinct?: ClassRecordScalarFieldEnum | ClassRecordScalarFieldEnum[]
  }

  /**
   * ClassRecord findFirstOrThrow
   */
  export type ClassRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    /**
     * Filter, which ClassRecord to fetch.
     */
    where?: ClassRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassRecords to fetch.
     */
    orderBy?: ClassRecordOrderByWithRelationInput | ClassRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClassRecords.
     */
    cursor?: ClassRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClassRecords.
     */
    distinct?: ClassRecordScalarFieldEnum | ClassRecordScalarFieldEnum[]
  }

  /**
   * ClassRecord findMany
   */
  export type ClassRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    /**
     * Filter, which ClassRecords to fetch.
     */
    where?: ClassRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassRecords to fetch.
     */
    orderBy?: ClassRecordOrderByWithRelationInput | ClassRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClassRecords.
     */
    cursor?: ClassRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassRecords.
     */
    skip?: number
    distinct?: ClassRecordScalarFieldEnum | ClassRecordScalarFieldEnum[]
  }

  /**
   * ClassRecord create
   */
  export type ClassRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a ClassRecord.
     */
    data: XOR<ClassRecordCreateInput, ClassRecordUncheckedCreateInput>
  }

  /**
   * ClassRecord createMany
   */
  export type ClassRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClassRecords.
     */
    data: ClassRecordCreateManyInput | ClassRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClassRecord createManyAndReturn
   */
  export type ClassRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * The data used to create many ClassRecords.
     */
    data: ClassRecordCreateManyInput | ClassRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClassRecord update
   */
  export type ClassRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a ClassRecord.
     */
    data: XOR<ClassRecordUpdateInput, ClassRecordUncheckedUpdateInput>
    /**
     * Choose, which ClassRecord to update.
     */
    where: ClassRecordWhereUniqueInput
  }

  /**
   * ClassRecord updateMany
   */
  export type ClassRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClassRecords.
     */
    data: XOR<ClassRecordUpdateManyMutationInput, ClassRecordUncheckedUpdateManyInput>
    /**
     * Filter which ClassRecords to update
     */
    where?: ClassRecordWhereInput
    /**
     * Limit how many ClassRecords to update.
     */
    limit?: number
  }

  /**
   * ClassRecord updateManyAndReturn
   */
  export type ClassRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * The data used to update ClassRecords.
     */
    data: XOR<ClassRecordUpdateManyMutationInput, ClassRecordUncheckedUpdateManyInput>
    /**
     * Filter which ClassRecords to update
     */
    where?: ClassRecordWhereInput
    /**
     * Limit how many ClassRecords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClassRecord upsert
   */
  export type ClassRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the ClassRecord to update in case it exists.
     */
    where: ClassRecordWhereUniqueInput
    /**
     * In case the ClassRecord found by the `where` argument doesn't exist, create a new ClassRecord with this data.
     */
    create: XOR<ClassRecordCreateInput, ClassRecordUncheckedCreateInput>
    /**
     * In case the ClassRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClassRecordUpdateInput, ClassRecordUncheckedUpdateInput>
  }

  /**
   * ClassRecord delete
   */
  export type ClassRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
    /**
     * Filter which ClassRecord to delete.
     */
    where: ClassRecordWhereUniqueInput
  }

  /**
   * ClassRecord deleteMany
   */
  export type ClassRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClassRecords to delete
     */
    where?: ClassRecordWhereInput
    /**
     * Limit how many ClassRecords to delete.
     */
    limit?: number
  }

  /**
   * ClassRecord without action
   */
  export type ClassRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRecord
     */
    select?: ClassRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRecord
     */
    omit?: ClassRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassRecordInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AuthScalarFieldEnum: {
    auth_id: 'auth_id',
    mail: 'mail',
    password: 'password',
    username: 'username',
    createdAt: 'createdAt'
  };

  export type AuthScalarFieldEnum = (typeof AuthScalarFieldEnum)[keyof typeof AuthScalarFieldEnum]


  export const StAccountScalarFieldEnum: {
    s_id: 's_id',
    auth_id: 'auth_id',
    name: 'name',
    is_demo: 'is_demo',
    updated_at: 'updated_at'
  };

  export type StAccountScalarFieldEnum = (typeof StAccountScalarFieldEnum)[keyof typeof StAccountScalarFieldEnum]


  export const SpecializationScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type SpecializationScalarFieldEnum = (typeof SpecializationScalarFieldEnum)[keyof typeof SpecializationScalarFieldEnum]


  export const TAccountScalarFieldEnum: {
    t_id: 't_id',
    auth_id: 'auth_id',
    name: 'name',
    bio: 'bio',
    rating: 'rating',
    updated_at: 'updated_at'
  };

  export type TAccountScalarFieldEnum = (typeof TAccountScalarFieldEnum)[keyof typeof TAccountScalarFieldEnum]


  export const PlanDescScalarFieldEnum: {
    plan_id: 'plan_id',
    plan_name: 'plan_name',
    desc: 'desc',
    duration: 'duration',
    price: 'price',
    sessionsIncluded: 'sessionsIncluded'
  };

  export type PlanDescScalarFieldEnum = (typeof PlanDescScalarFieldEnum)[keyof typeof PlanDescScalarFieldEnum]


  export const PlanRecordScalarFieldEnum: {
    record_no: 'record_no',
    s_id: 's_id',
    plan_id: 'plan_id',
    joinAt: 'joinAt',
    sessionsRem: 'sessionsRem',
    isValid: 'isValid'
  };

  export type PlanRecordScalarFieldEnum = (typeof PlanRecordScalarFieldEnum)[keyof typeof PlanRecordScalarFieldEnum]


  export const ClassRecordScalarFieldEnum: {
    record_no: 'record_no',
    t_id: 't_id',
    s_id: 's_id',
    plan_record_id: 'plan_record_id',
    link: 'link',
    startAt: 'startAt',
    endAt: 'endAt'
  };

  export type ClassRecordScalarFieldEnum = (typeof ClassRecordScalarFieldEnum)[keyof typeof ClassRecordScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AuthWhereInput = {
    AND?: AuthWhereInput | AuthWhereInput[]
    OR?: AuthWhereInput[]
    NOT?: AuthWhereInput | AuthWhereInput[]
    auth_id?: IntFilter<"Auth"> | number
    mail?: StringFilter<"Auth"> | string
    password?: StringFilter<"Auth"> | string
    username?: StringNullableFilter<"Auth"> | string | null
    createdAt?: DateTimeFilter<"Auth"> | Date | string
    student?: XOR<StAccountNullableScalarRelationFilter, StAccountWhereInput> | null
    teacher?: XOR<TAccountNullableScalarRelationFilter, TAccountWhereInput> | null
  }

  export type AuthOrderByWithRelationInput = {
    auth_id?: SortOrder
    mail?: SortOrder
    password?: SortOrder
    username?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    student?: StAccountOrderByWithRelationInput
    teacher?: TAccountOrderByWithRelationInput
  }

  export type AuthWhereUniqueInput = Prisma.AtLeast<{
    auth_id?: number
    mail?: string
    AND?: AuthWhereInput | AuthWhereInput[]
    OR?: AuthWhereInput[]
    NOT?: AuthWhereInput | AuthWhereInput[]
    password?: StringFilter<"Auth"> | string
    username?: StringNullableFilter<"Auth"> | string | null
    createdAt?: DateTimeFilter<"Auth"> | Date | string
    student?: XOR<StAccountNullableScalarRelationFilter, StAccountWhereInput> | null
    teacher?: XOR<TAccountNullableScalarRelationFilter, TAccountWhereInput> | null
  }, "auth_id" | "mail">

  export type AuthOrderByWithAggregationInput = {
    auth_id?: SortOrder
    mail?: SortOrder
    password?: SortOrder
    username?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuthCountOrderByAggregateInput
    _avg?: AuthAvgOrderByAggregateInput
    _max?: AuthMaxOrderByAggregateInput
    _min?: AuthMinOrderByAggregateInput
    _sum?: AuthSumOrderByAggregateInput
  }

  export type AuthScalarWhereWithAggregatesInput = {
    AND?: AuthScalarWhereWithAggregatesInput | AuthScalarWhereWithAggregatesInput[]
    OR?: AuthScalarWhereWithAggregatesInput[]
    NOT?: AuthScalarWhereWithAggregatesInput | AuthScalarWhereWithAggregatesInput[]
    auth_id?: IntWithAggregatesFilter<"Auth"> | number
    mail?: StringWithAggregatesFilter<"Auth"> | string
    password?: StringWithAggregatesFilter<"Auth"> | string
    username?: StringNullableWithAggregatesFilter<"Auth"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Auth"> | Date | string
  }

  export type StAccountWhereInput = {
    AND?: StAccountWhereInput | StAccountWhereInput[]
    OR?: StAccountWhereInput[]
    NOT?: StAccountWhereInput | StAccountWhereInput[]
    s_id?: IntFilter<"StAccount"> | number
    auth_id?: IntFilter<"StAccount"> | number
    name?: StringFilter<"StAccount"> | string
    is_demo?: BoolFilter<"StAccount"> | boolean
    updated_at?: DateTimeNullableFilter<"StAccount"> | Date | string | null
    auth?: XOR<AuthScalarRelationFilter, AuthWhereInput>
    plans?: PlanRecordListRelationFilter
    classes?: ClassRecordListRelationFilter
  }

  export type StAccountOrderByWithRelationInput = {
    s_id?: SortOrder
    auth_id?: SortOrder
    name?: SortOrder
    is_demo?: SortOrder
    updated_at?: SortOrderInput | SortOrder
    auth?: AuthOrderByWithRelationInput
    plans?: PlanRecordOrderByRelationAggregateInput
    classes?: ClassRecordOrderByRelationAggregateInput
  }

  export type StAccountWhereUniqueInput = Prisma.AtLeast<{
    s_id?: number
    auth_id?: number
    AND?: StAccountWhereInput | StAccountWhereInput[]
    OR?: StAccountWhereInput[]
    NOT?: StAccountWhereInput | StAccountWhereInput[]
    name?: StringFilter<"StAccount"> | string
    is_demo?: BoolFilter<"StAccount"> | boolean
    updated_at?: DateTimeNullableFilter<"StAccount"> | Date | string | null
    auth?: XOR<AuthScalarRelationFilter, AuthWhereInput>
    plans?: PlanRecordListRelationFilter
    classes?: ClassRecordListRelationFilter
  }, "s_id" | "auth_id">

  export type StAccountOrderByWithAggregationInput = {
    s_id?: SortOrder
    auth_id?: SortOrder
    name?: SortOrder
    is_demo?: SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: StAccountCountOrderByAggregateInput
    _avg?: StAccountAvgOrderByAggregateInput
    _max?: StAccountMaxOrderByAggregateInput
    _min?: StAccountMinOrderByAggregateInput
    _sum?: StAccountSumOrderByAggregateInput
  }

  export type StAccountScalarWhereWithAggregatesInput = {
    AND?: StAccountScalarWhereWithAggregatesInput | StAccountScalarWhereWithAggregatesInput[]
    OR?: StAccountScalarWhereWithAggregatesInput[]
    NOT?: StAccountScalarWhereWithAggregatesInput | StAccountScalarWhereWithAggregatesInput[]
    s_id?: IntWithAggregatesFilter<"StAccount"> | number
    auth_id?: IntWithAggregatesFilter<"StAccount"> | number
    name?: StringWithAggregatesFilter<"StAccount"> | string
    is_demo?: BoolWithAggregatesFilter<"StAccount"> | boolean
    updated_at?: DateTimeNullableWithAggregatesFilter<"StAccount"> | Date | string | null
  }

  export type SpecializationWhereInput = {
    AND?: SpecializationWhereInput | SpecializationWhereInput[]
    OR?: SpecializationWhereInput[]
    NOT?: SpecializationWhereInput | SpecializationWhereInput[]
    id?: IntFilter<"Specialization"> | number
    name?: StringFilter<"Specialization"> | string
    teachers?: TAccountListRelationFilter
  }

  export type SpecializationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    teachers?: TAccountOrderByRelationAggregateInput
  }

  export type SpecializationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: SpecializationWhereInput | SpecializationWhereInput[]
    OR?: SpecializationWhereInput[]
    NOT?: SpecializationWhereInput | SpecializationWhereInput[]
    teachers?: TAccountListRelationFilter
  }, "id" | "name">

  export type SpecializationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: SpecializationCountOrderByAggregateInput
    _avg?: SpecializationAvgOrderByAggregateInput
    _max?: SpecializationMaxOrderByAggregateInput
    _min?: SpecializationMinOrderByAggregateInput
    _sum?: SpecializationSumOrderByAggregateInput
  }

  export type SpecializationScalarWhereWithAggregatesInput = {
    AND?: SpecializationScalarWhereWithAggregatesInput | SpecializationScalarWhereWithAggregatesInput[]
    OR?: SpecializationScalarWhereWithAggregatesInput[]
    NOT?: SpecializationScalarWhereWithAggregatesInput | SpecializationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Specialization"> | number
    name?: StringWithAggregatesFilter<"Specialization"> | string
  }

  export type TAccountWhereInput = {
    AND?: TAccountWhereInput | TAccountWhereInput[]
    OR?: TAccountWhereInput[]
    NOT?: TAccountWhereInput | TAccountWhereInput[]
    t_id?: IntFilter<"TAccount"> | number
    auth_id?: IntFilter<"TAccount"> | number
    name?: StringFilter<"TAccount"> | string
    bio?: StringNullableFilter<"TAccount"> | string | null
    rating?: FloatNullableFilter<"TAccount"> | number | null
    updated_at?: DateTimeNullableFilter<"TAccount"> | Date | string | null
    auth?: XOR<AuthScalarRelationFilter, AuthWhereInput>
    specs?: SpecializationListRelationFilter
    classes?: ClassRecordListRelationFilter
  }

  export type TAccountOrderByWithRelationInput = {
    t_id?: SortOrder
    auth_id?: SortOrder
    name?: SortOrder
    bio?: SortOrderInput | SortOrder
    rating?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    auth?: AuthOrderByWithRelationInput
    specs?: SpecializationOrderByRelationAggregateInput
    classes?: ClassRecordOrderByRelationAggregateInput
  }

  export type TAccountWhereUniqueInput = Prisma.AtLeast<{
    t_id?: number
    auth_id?: number
    AND?: TAccountWhereInput | TAccountWhereInput[]
    OR?: TAccountWhereInput[]
    NOT?: TAccountWhereInput | TAccountWhereInput[]
    name?: StringFilter<"TAccount"> | string
    bio?: StringNullableFilter<"TAccount"> | string | null
    rating?: FloatNullableFilter<"TAccount"> | number | null
    updated_at?: DateTimeNullableFilter<"TAccount"> | Date | string | null
    auth?: XOR<AuthScalarRelationFilter, AuthWhereInput>
    specs?: SpecializationListRelationFilter
    classes?: ClassRecordListRelationFilter
  }, "t_id" | "auth_id">

  export type TAccountOrderByWithAggregationInput = {
    t_id?: SortOrder
    auth_id?: SortOrder
    name?: SortOrder
    bio?: SortOrderInput | SortOrder
    rating?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: TAccountCountOrderByAggregateInput
    _avg?: TAccountAvgOrderByAggregateInput
    _max?: TAccountMaxOrderByAggregateInput
    _min?: TAccountMinOrderByAggregateInput
    _sum?: TAccountSumOrderByAggregateInput
  }

  export type TAccountScalarWhereWithAggregatesInput = {
    AND?: TAccountScalarWhereWithAggregatesInput | TAccountScalarWhereWithAggregatesInput[]
    OR?: TAccountScalarWhereWithAggregatesInput[]
    NOT?: TAccountScalarWhereWithAggregatesInput | TAccountScalarWhereWithAggregatesInput[]
    t_id?: IntWithAggregatesFilter<"TAccount"> | number
    auth_id?: IntWithAggregatesFilter<"TAccount"> | number
    name?: StringWithAggregatesFilter<"TAccount"> | string
    bio?: StringNullableWithAggregatesFilter<"TAccount"> | string | null
    rating?: FloatNullableWithAggregatesFilter<"TAccount"> | number | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"TAccount"> | Date | string | null
  }

  export type PlanDescWhereInput = {
    AND?: PlanDescWhereInput | PlanDescWhereInput[]
    OR?: PlanDescWhereInput[]
    NOT?: PlanDescWhereInput | PlanDescWhereInput[]
    plan_id?: IntFilter<"PlanDesc"> | number
    plan_name?: StringFilter<"PlanDesc"> | string
    desc?: StringNullableFilter<"PlanDesc"> | string | null
    duration?: IntFilter<"PlanDesc"> | number
    price?: FloatFilter<"PlanDesc"> | number
    sessionsIncluded?: IntFilter<"PlanDesc"> | number
    records?: PlanRecordListRelationFilter
  }

  export type PlanDescOrderByWithRelationInput = {
    plan_id?: SortOrder
    plan_name?: SortOrder
    desc?: SortOrderInput | SortOrder
    duration?: SortOrder
    price?: SortOrder
    sessionsIncluded?: SortOrder
    records?: PlanRecordOrderByRelationAggregateInput
  }

  export type PlanDescWhereUniqueInput = Prisma.AtLeast<{
    plan_id?: number
    AND?: PlanDescWhereInput | PlanDescWhereInput[]
    OR?: PlanDescWhereInput[]
    NOT?: PlanDescWhereInput | PlanDescWhereInput[]
    plan_name?: StringFilter<"PlanDesc"> | string
    desc?: StringNullableFilter<"PlanDesc"> | string | null
    duration?: IntFilter<"PlanDesc"> | number
    price?: FloatFilter<"PlanDesc"> | number
    sessionsIncluded?: IntFilter<"PlanDesc"> | number
    records?: PlanRecordListRelationFilter
  }, "plan_id">

  export type PlanDescOrderByWithAggregationInput = {
    plan_id?: SortOrder
    plan_name?: SortOrder
    desc?: SortOrderInput | SortOrder
    duration?: SortOrder
    price?: SortOrder
    sessionsIncluded?: SortOrder
    _count?: PlanDescCountOrderByAggregateInput
    _avg?: PlanDescAvgOrderByAggregateInput
    _max?: PlanDescMaxOrderByAggregateInput
    _min?: PlanDescMinOrderByAggregateInput
    _sum?: PlanDescSumOrderByAggregateInput
  }

  export type PlanDescScalarWhereWithAggregatesInput = {
    AND?: PlanDescScalarWhereWithAggregatesInput | PlanDescScalarWhereWithAggregatesInput[]
    OR?: PlanDescScalarWhereWithAggregatesInput[]
    NOT?: PlanDescScalarWhereWithAggregatesInput | PlanDescScalarWhereWithAggregatesInput[]
    plan_id?: IntWithAggregatesFilter<"PlanDesc"> | number
    plan_name?: StringWithAggregatesFilter<"PlanDesc"> | string
    desc?: StringNullableWithAggregatesFilter<"PlanDesc"> | string | null
    duration?: IntWithAggregatesFilter<"PlanDesc"> | number
    price?: FloatWithAggregatesFilter<"PlanDesc"> | number
    sessionsIncluded?: IntWithAggregatesFilter<"PlanDesc"> | number
  }

  export type PlanRecordWhereInput = {
    AND?: PlanRecordWhereInput | PlanRecordWhereInput[]
    OR?: PlanRecordWhereInput[]
    NOT?: PlanRecordWhereInput | PlanRecordWhereInput[]
    record_no?: IntFilter<"PlanRecord"> | number
    s_id?: IntFilter<"PlanRecord"> | number
    plan_id?: IntFilter<"PlanRecord"> | number
    joinAt?: DateTimeFilter<"PlanRecord"> | Date | string
    sessionsRem?: IntFilter<"PlanRecord"> | number
    isValid?: BoolFilter<"PlanRecord"> | boolean
    student?: XOR<StAccountScalarRelationFilter, StAccountWhereInput>
    plan?: XOR<PlanDescScalarRelationFilter, PlanDescWhereInput>
    classes?: ClassRecordListRelationFilter
  }

  export type PlanRecordOrderByWithRelationInput = {
    record_no?: SortOrder
    s_id?: SortOrder
    plan_id?: SortOrder
    joinAt?: SortOrder
    sessionsRem?: SortOrder
    isValid?: SortOrder
    student?: StAccountOrderByWithRelationInput
    plan?: PlanDescOrderByWithRelationInput
    classes?: ClassRecordOrderByRelationAggregateInput
  }

  export type PlanRecordWhereUniqueInput = Prisma.AtLeast<{
    record_no?: number
    AND?: PlanRecordWhereInput | PlanRecordWhereInput[]
    OR?: PlanRecordWhereInput[]
    NOT?: PlanRecordWhereInput | PlanRecordWhereInput[]
    s_id?: IntFilter<"PlanRecord"> | number
    plan_id?: IntFilter<"PlanRecord"> | number
    joinAt?: DateTimeFilter<"PlanRecord"> | Date | string
    sessionsRem?: IntFilter<"PlanRecord"> | number
    isValid?: BoolFilter<"PlanRecord"> | boolean
    student?: XOR<StAccountScalarRelationFilter, StAccountWhereInput>
    plan?: XOR<PlanDescScalarRelationFilter, PlanDescWhereInput>
    classes?: ClassRecordListRelationFilter
  }, "record_no">

  export type PlanRecordOrderByWithAggregationInput = {
    record_no?: SortOrder
    s_id?: SortOrder
    plan_id?: SortOrder
    joinAt?: SortOrder
    sessionsRem?: SortOrder
    isValid?: SortOrder
    _count?: PlanRecordCountOrderByAggregateInput
    _avg?: PlanRecordAvgOrderByAggregateInput
    _max?: PlanRecordMaxOrderByAggregateInput
    _min?: PlanRecordMinOrderByAggregateInput
    _sum?: PlanRecordSumOrderByAggregateInput
  }

  export type PlanRecordScalarWhereWithAggregatesInput = {
    AND?: PlanRecordScalarWhereWithAggregatesInput | PlanRecordScalarWhereWithAggregatesInput[]
    OR?: PlanRecordScalarWhereWithAggregatesInput[]
    NOT?: PlanRecordScalarWhereWithAggregatesInput | PlanRecordScalarWhereWithAggregatesInput[]
    record_no?: IntWithAggregatesFilter<"PlanRecord"> | number
    s_id?: IntWithAggregatesFilter<"PlanRecord"> | number
    plan_id?: IntWithAggregatesFilter<"PlanRecord"> | number
    joinAt?: DateTimeWithAggregatesFilter<"PlanRecord"> | Date | string
    sessionsRem?: IntWithAggregatesFilter<"PlanRecord"> | number
    isValid?: BoolWithAggregatesFilter<"PlanRecord"> | boolean
  }

  export type ClassRecordWhereInput = {
    AND?: ClassRecordWhereInput | ClassRecordWhereInput[]
    OR?: ClassRecordWhereInput[]
    NOT?: ClassRecordWhereInput | ClassRecordWhereInput[]
    record_no?: IntFilter<"ClassRecord"> | number
    t_id?: IntFilter<"ClassRecord"> | number
    s_id?: IntFilter<"ClassRecord"> | number
    plan_record_id?: IntFilter<"ClassRecord"> | number
    link?: StringNullableFilter<"ClassRecord"> | string | null
    startAt?: DateTimeFilter<"ClassRecord"> | Date | string
    endAt?: DateTimeNullableFilter<"ClassRecord"> | Date | string | null
    teacher?: XOR<TAccountScalarRelationFilter, TAccountWhereInput>
    student?: XOR<StAccountScalarRelationFilter, StAccountWhereInput>
    planRecord?: XOR<PlanRecordScalarRelationFilter, PlanRecordWhereInput>
  }

  export type ClassRecordOrderByWithRelationInput = {
    record_no?: SortOrder
    t_id?: SortOrder
    s_id?: SortOrder
    plan_record_id?: SortOrder
    link?: SortOrderInput | SortOrder
    startAt?: SortOrder
    endAt?: SortOrderInput | SortOrder
    teacher?: TAccountOrderByWithRelationInput
    student?: StAccountOrderByWithRelationInput
    planRecord?: PlanRecordOrderByWithRelationInput
  }

  export type ClassRecordWhereUniqueInput = Prisma.AtLeast<{
    record_no?: number
    AND?: ClassRecordWhereInput | ClassRecordWhereInput[]
    OR?: ClassRecordWhereInput[]
    NOT?: ClassRecordWhereInput | ClassRecordWhereInput[]
    t_id?: IntFilter<"ClassRecord"> | number
    s_id?: IntFilter<"ClassRecord"> | number
    plan_record_id?: IntFilter<"ClassRecord"> | number
    link?: StringNullableFilter<"ClassRecord"> | string | null
    startAt?: DateTimeFilter<"ClassRecord"> | Date | string
    endAt?: DateTimeNullableFilter<"ClassRecord"> | Date | string | null
    teacher?: XOR<TAccountScalarRelationFilter, TAccountWhereInput>
    student?: XOR<StAccountScalarRelationFilter, StAccountWhereInput>
    planRecord?: XOR<PlanRecordScalarRelationFilter, PlanRecordWhereInput>
  }, "record_no">

  export type ClassRecordOrderByWithAggregationInput = {
    record_no?: SortOrder
    t_id?: SortOrder
    s_id?: SortOrder
    plan_record_id?: SortOrder
    link?: SortOrderInput | SortOrder
    startAt?: SortOrder
    endAt?: SortOrderInput | SortOrder
    _count?: ClassRecordCountOrderByAggregateInput
    _avg?: ClassRecordAvgOrderByAggregateInput
    _max?: ClassRecordMaxOrderByAggregateInput
    _min?: ClassRecordMinOrderByAggregateInput
    _sum?: ClassRecordSumOrderByAggregateInput
  }

  export type ClassRecordScalarWhereWithAggregatesInput = {
    AND?: ClassRecordScalarWhereWithAggregatesInput | ClassRecordScalarWhereWithAggregatesInput[]
    OR?: ClassRecordScalarWhereWithAggregatesInput[]
    NOT?: ClassRecordScalarWhereWithAggregatesInput | ClassRecordScalarWhereWithAggregatesInput[]
    record_no?: IntWithAggregatesFilter<"ClassRecord"> | number
    t_id?: IntWithAggregatesFilter<"ClassRecord"> | number
    s_id?: IntWithAggregatesFilter<"ClassRecord"> | number
    plan_record_id?: IntWithAggregatesFilter<"ClassRecord"> | number
    link?: StringNullableWithAggregatesFilter<"ClassRecord"> | string | null
    startAt?: DateTimeWithAggregatesFilter<"ClassRecord"> | Date | string
    endAt?: DateTimeNullableWithAggregatesFilter<"ClassRecord"> | Date | string | null
  }

  export type AuthCreateInput = {
    mail: string
    password: string
    username?: string | null
    createdAt?: Date | string
    student?: StAccountCreateNestedOneWithoutAuthInput
    teacher?: TAccountCreateNestedOneWithoutAuthInput
  }

  export type AuthUncheckedCreateInput = {
    auth_id?: number
    mail: string
    password: string
    username?: string | null
    createdAt?: Date | string
    student?: StAccountUncheckedCreateNestedOneWithoutAuthInput
    teacher?: TAccountUncheckedCreateNestedOneWithoutAuthInput
  }

  export type AuthUpdateInput = {
    mail?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StAccountUpdateOneWithoutAuthNestedInput
    teacher?: TAccountUpdateOneWithoutAuthNestedInput
  }

  export type AuthUncheckedUpdateInput = {
    auth_id?: IntFieldUpdateOperationsInput | number
    mail?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StAccountUncheckedUpdateOneWithoutAuthNestedInput
    teacher?: TAccountUncheckedUpdateOneWithoutAuthNestedInput
  }

  export type AuthCreateManyInput = {
    auth_id?: number
    mail: string
    password: string
    username?: string | null
    createdAt?: Date | string
  }

  export type AuthUpdateManyMutationInput = {
    mail?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthUncheckedUpdateManyInput = {
    auth_id?: IntFieldUpdateOperationsInput | number
    mail?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StAccountCreateInput = {
    name: string
    is_demo?: boolean
    updated_at?: Date | string | null
    auth: AuthCreateNestedOneWithoutStudentInput
    plans?: PlanRecordCreateNestedManyWithoutStudentInput
    classes?: ClassRecordCreateNestedManyWithoutStudentInput
  }

  export type StAccountUncheckedCreateInput = {
    s_id?: number
    auth_id: number
    name: string
    is_demo?: boolean
    updated_at?: Date | string | null
    plans?: PlanRecordUncheckedCreateNestedManyWithoutStudentInput
    classes?: ClassRecordUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StAccountUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    is_demo?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auth?: AuthUpdateOneRequiredWithoutStudentNestedInput
    plans?: PlanRecordUpdateManyWithoutStudentNestedInput
    classes?: ClassRecordUpdateManyWithoutStudentNestedInput
  }

  export type StAccountUncheckedUpdateInput = {
    s_id?: IntFieldUpdateOperationsInput | number
    auth_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    is_demo?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plans?: PlanRecordUncheckedUpdateManyWithoutStudentNestedInput
    classes?: ClassRecordUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StAccountCreateManyInput = {
    s_id?: number
    auth_id: number
    name: string
    is_demo?: boolean
    updated_at?: Date | string | null
  }

  export type StAccountUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    is_demo?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StAccountUncheckedUpdateManyInput = {
    s_id?: IntFieldUpdateOperationsInput | number
    auth_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    is_demo?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SpecializationCreateInput = {
    name: string
    teachers?: TAccountCreateNestedManyWithoutSpecsInput
  }

  export type SpecializationUncheckedCreateInput = {
    id?: number
    name: string
    teachers?: TAccountUncheckedCreateNestedManyWithoutSpecsInput
  }

  export type SpecializationUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    teachers?: TAccountUpdateManyWithoutSpecsNestedInput
  }

  export type SpecializationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    teachers?: TAccountUncheckedUpdateManyWithoutSpecsNestedInput
  }

  export type SpecializationCreateManyInput = {
    id?: number
    name: string
  }

  export type SpecializationUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type SpecializationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TAccountCreateInput = {
    name: string
    bio?: string | null
    rating?: number | null
    updated_at?: Date | string | null
    auth: AuthCreateNestedOneWithoutTeacherInput
    specs?: SpecializationCreateNestedManyWithoutTeachersInput
    classes?: ClassRecordCreateNestedManyWithoutTeacherInput
  }

  export type TAccountUncheckedCreateInput = {
    t_id?: number
    auth_id: number
    name: string
    bio?: string | null
    rating?: number | null
    updated_at?: Date | string | null
    specs?: SpecializationUncheckedCreateNestedManyWithoutTeachersInput
    classes?: ClassRecordUncheckedCreateNestedManyWithoutTeacherInput
  }

  export type TAccountUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auth?: AuthUpdateOneRequiredWithoutTeacherNestedInput
    specs?: SpecializationUpdateManyWithoutTeachersNestedInput
    classes?: ClassRecordUpdateManyWithoutTeacherNestedInput
  }

  export type TAccountUncheckedUpdateInput = {
    t_id?: IntFieldUpdateOperationsInput | number
    auth_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    specs?: SpecializationUncheckedUpdateManyWithoutTeachersNestedInput
    classes?: ClassRecordUncheckedUpdateManyWithoutTeacherNestedInput
  }

  export type TAccountCreateManyInput = {
    t_id?: number
    auth_id: number
    name: string
    bio?: string | null
    rating?: number | null
    updated_at?: Date | string | null
  }

  export type TAccountUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TAccountUncheckedUpdateManyInput = {
    t_id?: IntFieldUpdateOperationsInput | number
    auth_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PlanDescCreateInput = {
    plan_name: string
    desc?: string | null
    duration: number
    price: number
    sessionsIncluded: number
    records?: PlanRecordCreateNestedManyWithoutPlanInput
  }

  export type PlanDescUncheckedCreateInput = {
    plan_id?: number
    plan_name: string
    desc?: string | null
    duration: number
    price: number
    sessionsIncluded: number
    records?: PlanRecordUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanDescUpdateInput = {
    plan_name?: StringFieldUpdateOperationsInput | string
    desc?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    sessionsIncluded?: IntFieldUpdateOperationsInput | number
    records?: PlanRecordUpdateManyWithoutPlanNestedInput
  }

  export type PlanDescUncheckedUpdateInput = {
    plan_id?: IntFieldUpdateOperationsInput | number
    plan_name?: StringFieldUpdateOperationsInput | string
    desc?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    sessionsIncluded?: IntFieldUpdateOperationsInput | number
    records?: PlanRecordUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PlanDescCreateManyInput = {
    plan_id?: number
    plan_name: string
    desc?: string | null
    duration: number
    price: number
    sessionsIncluded: number
  }

  export type PlanDescUpdateManyMutationInput = {
    plan_name?: StringFieldUpdateOperationsInput | string
    desc?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    sessionsIncluded?: IntFieldUpdateOperationsInput | number
  }

  export type PlanDescUncheckedUpdateManyInput = {
    plan_id?: IntFieldUpdateOperationsInput | number
    plan_name?: StringFieldUpdateOperationsInput | string
    desc?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    sessionsIncluded?: IntFieldUpdateOperationsInput | number
  }

  export type PlanRecordCreateInput = {
    joinAt?: Date | string
    sessionsRem: number
    isValid?: boolean
    student: StAccountCreateNestedOneWithoutPlansInput
    plan: PlanDescCreateNestedOneWithoutRecordsInput
    classes?: ClassRecordCreateNestedManyWithoutPlanRecordInput
  }

  export type PlanRecordUncheckedCreateInput = {
    record_no?: number
    s_id: number
    plan_id: number
    joinAt?: Date | string
    sessionsRem: number
    isValid?: boolean
    classes?: ClassRecordUncheckedCreateNestedManyWithoutPlanRecordInput
  }

  export type PlanRecordUpdateInput = {
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
    student?: StAccountUpdateOneRequiredWithoutPlansNestedInput
    plan?: PlanDescUpdateOneRequiredWithoutRecordsNestedInput
    classes?: ClassRecordUpdateManyWithoutPlanRecordNestedInput
  }

  export type PlanRecordUncheckedUpdateInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    s_id?: IntFieldUpdateOperationsInput | number
    plan_id?: IntFieldUpdateOperationsInput | number
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
    classes?: ClassRecordUncheckedUpdateManyWithoutPlanRecordNestedInput
  }

  export type PlanRecordCreateManyInput = {
    record_no?: number
    s_id: number
    plan_id: number
    joinAt?: Date | string
    sessionsRem: number
    isValid?: boolean
  }

  export type PlanRecordUpdateManyMutationInput = {
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PlanRecordUncheckedUpdateManyInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    s_id?: IntFieldUpdateOperationsInput | number
    plan_id?: IntFieldUpdateOperationsInput | number
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ClassRecordCreateInput = {
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
    teacher: TAccountCreateNestedOneWithoutClassesInput
    student: StAccountCreateNestedOneWithoutClassesInput
    planRecord: PlanRecordCreateNestedOneWithoutClassesInput
  }

  export type ClassRecordUncheckedCreateInput = {
    record_no?: number
    t_id: number
    s_id: number
    plan_record_id: number
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
  }

  export type ClassRecordUpdateInput = {
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    teacher?: TAccountUpdateOneRequiredWithoutClassesNestedInput
    student?: StAccountUpdateOneRequiredWithoutClassesNestedInput
    planRecord?: PlanRecordUpdateOneRequiredWithoutClassesNestedInput
  }

  export type ClassRecordUncheckedUpdateInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    t_id?: IntFieldUpdateOperationsInput | number
    s_id?: IntFieldUpdateOperationsInput | number
    plan_record_id?: IntFieldUpdateOperationsInput | number
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClassRecordCreateManyInput = {
    record_no?: number
    t_id: number
    s_id: number
    plan_record_id: number
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
  }

  export type ClassRecordUpdateManyMutationInput = {
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClassRecordUncheckedUpdateManyInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    t_id?: IntFieldUpdateOperationsInput | number
    s_id?: IntFieldUpdateOperationsInput | number
    plan_record_id?: IntFieldUpdateOperationsInput | number
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StAccountNullableScalarRelationFilter = {
    is?: StAccountWhereInput | null
    isNot?: StAccountWhereInput | null
  }

  export type TAccountNullableScalarRelationFilter = {
    is?: TAccountWhereInput | null
    isNot?: TAccountWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuthCountOrderByAggregateInput = {
    auth_id?: SortOrder
    mail?: SortOrder
    password?: SortOrder
    username?: SortOrder
    createdAt?: SortOrder
  }

  export type AuthAvgOrderByAggregateInput = {
    auth_id?: SortOrder
  }

  export type AuthMaxOrderByAggregateInput = {
    auth_id?: SortOrder
    mail?: SortOrder
    password?: SortOrder
    username?: SortOrder
    createdAt?: SortOrder
  }

  export type AuthMinOrderByAggregateInput = {
    auth_id?: SortOrder
    mail?: SortOrder
    password?: SortOrder
    username?: SortOrder
    createdAt?: SortOrder
  }

  export type AuthSumOrderByAggregateInput = {
    auth_id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AuthScalarRelationFilter = {
    is?: AuthWhereInput
    isNot?: AuthWhereInput
  }

  export type PlanRecordListRelationFilter = {
    every?: PlanRecordWhereInput
    some?: PlanRecordWhereInput
    none?: PlanRecordWhereInput
  }

  export type ClassRecordListRelationFilter = {
    every?: ClassRecordWhereInput
    some?: ClassRecordWhereInput
    none?: ClassRecordWhereInput
  }

  export type PlanRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClassRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StAccountCountOrderByAggregateInput = {
    s_id?: SortOrder
    auth_id?: SortOrder
    name?: SortOrder
    is_demo?: SortOrder
    updated_at?: SortOrder
  }

  export type StAccountAvgOrderByAggregateInput = {
    s_id?: SortOrder
    auth_id?: SortOrder
  }

  export type StAccountMaxOrderByAggregateInput = {
    s_id?: SortOrder
    auth_id?: SortOrder
    name?: SortOrder
    is_demo?: SortOrder
    updated_at?: SortOrder
  }

  export type StAccountMinOrderByAggregateInput = {
    s_id?: SortOrder
    auth_id?: SortOrder
    name?: SortOrder
    is_demo?: SortOrder
    updated_at?: SortOrder
  }

  export type StAccountSumOrderByAggregateInput = {
    s_id?: SortOrder
    auth_id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type TAccountListRelationFilter = {
    every?: TAccountWhereInput
    some?: TAccountWhereInput
    none?: TAccountWhereInput
  }

  export type TAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SpecializationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type SpecializationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SpecializationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type SpecializationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type SpecializationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type SpecializationListRelationFilter = {
    every?: SpecializationWhereInput
    some?: SpecializationWhereInput
    none?: SpecializationWhereInput
  }

  export type SpecializationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TAccountCountOrderByAggregateInput = {
    t_id?: SortOrder
    auth_id?: SortOrder
    name?: SortOrder
    bio?: SortOrder
    rating?: SortOrder
    updated_at?: SortOrder
  }

  export type TAccountAvgOrderByAggregateInput = {
    t_id?: SortOrder
    auth_id?: SortOrder
    rating?: SortOrder
  }

  export type TAccountMaxOrderByAggregateInput = {
    t_id?: SortOrder
    auth_id?: SortOrder
    name?: SortOrder
    bio?: SortOrder
    rating?: SortOrder
    updated_at?: SortOrder
  }

  export type TAccountMinOrderByAggregateInput = {
    t_id?: SortOrder
    auth_id?: SortOrder
    name?: SortOrder
    bio?: SortOrder
    rating?: SortOrder
    updated_at?: SortOrder
  }

  export type TAccountSumOrderByAggregateInput = {
    t_id?: SortOrder
    auth_id?: SortOrder
    rating?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PlanDescCountOrderByAggregateInput = {
    plan_id?: SortOrder
    plan_name?: SortOrder
    desc?: SortOrder
    duration?: SortOrder
    price?: SortOrder
    sessionsIncluded?: SortOrder
  }

  export type PlanDescAvgOrderByAggregateInput = {
    plan_id?: SortOrder
    duration?: SortOrder
    price?: SortOrder
    sessionsIncluded?: SortOrder
  }

  export type PlanDescMaxOrderByAggregateInput = {
    plan_id?: SortOrder
    plan_name?: SortOrder
    desc?: SortOrder
    duration?: SortOrder
    price?: SortOrder
    sessionsIncluded?: SortOrder
  }

  export type PlanDescMinOrderByAggregateInput = {
    plan_id?: SortOrder
    plan_name?: SortOrder
    desc?: SortOrder
    duration?: SortOrder
    price?: SortOrder
    sessionsIncluded?: SortOrder
  }

  export type PlanDescSumOrderByAggregateInput = {
    plan_id?: SortOrder
    duration?: SortOrder
    price?: SortOrder
    sessionsIncluded?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type StAccountScalarRelationFilter = {
    is?: StAccountWhereInput
    isNot?: StAccountWhereInput
  }

  export type PlanDescScalarRelationFilter = {
    is?: PlanDescWhereInput
    isNot?: PlanDescWhereInput
  }

  export type PlanRecordCountOrderByAggregateInput = {
    record_no?: SortOrder
    s_id?: SortOrder
    plan_id?: SortOrder
    joinAt?: SortOrder
    sessionsRem?: SortOrder
    isValid?: SortOrder
  }

  export type PlanRecordAvgOrderByAggregateInput = {
    record_no?: SortOrder
    s_id?: SortOrder
    plan_id?: SortOrder
    sessionsRem?: SortOrder
  }

  export type PlanRecordMaxOrderByAggregateInput = {
    record_no?: SortOrder
    s_id?: SortOrder
    plan_id?: SortOrder
    joinAt?: SortOrder
    sessionsRem?: SortOrder
    isValid?: SortOrder
  }

  export type PlanRecordMinOrderByAggregateInput = {
    record_no?: SortOrder
    s_id?: SortOrder
    plan_id?: SortOrder
    joinAt?: SortOrder
    sessionsRem?: SortOrder
    isValid?: SortOrder
  }

  export type PlanRecordSumOrderByAggregateInput = {
    record_no?: SortOrder
    s_id?: SortOrder
    plan_id?: SortOrder
    sessionsRem?: SortOrder
  }

  export type TAccountScalarRelationFilter = {
    is?: TAccountWhereInput
    isNot?: TAccountWhereInput
  }

  export type PlanRecordScalarRelationFilter = {
    is?: PlanRecordWhereInput
    isNot?: PlanRecordWhereInput
  }

  export type ClassRecordCountOrderByAggregateInput = {
    record_no?: SortOrder
    t_id?: SortOrder
    s_id?: SortOrder
    plan_record_id?: SortOrder
    link?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
  }

  export type ClassRecordAvgOrderByAggregateInput = {
    record_no?: SortOrder
    t_id?: SortOrder
    s_id?: SortOrder
    plan_record_id?: SortOrder
  }

  export type ClassRecordMaxOrderByAggregateInput = {
    record_no?: SortOrder
    t_id?: SortOrder
    s_id?: SortOrder
    plan_record_id?: SortOrder
    link?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
  }

  export type ClassRecordMinOrderByAggregateInput = {
    record_no?: SortOrder
    t_id?: SortOrder
    s_id?: SortOrder
    plan_record_id?: SortOrder
    link?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
  }

  export type ClassRecordSumOrderByAggregateInput = {
    record_no?: SortOrder
    t_id?: SortOrder
    s_id?: SortOrder
    plan_record_id?: SortOrder
  }

  export type StAccountCreateNestedOneWithoutAuthInput = {
    create?: XOR<StAccountCreateWithoutAuthInput, StAccountUncheckedCreateWithoutAuthInput>
    connectOrCreate?: StAccountCreateOrConnectWithoutAuthInput
    connect?: StAccountWhereUniqueInput
  }

  export type TAccountCreateNestedOneWithoutAuthInput = {
    create?: XOR<TAccountCreateWithoutAuthInput, TAccountUncheckedCreateWithoutAuthInput>
    connectOrCreate?: TAccountCreateOrConnectWithoutAuthInput
    connect?: TAccountWhereUniqueInput
  }

  export type StAccountUncheckedCreateNestedOneWithoutAuthInput = {
    create?: XOR<StAccountCreateWithoutAuthInput, StAccountUncheckedCreateWithoutAuthInput>
    connectOrCreate?: StAccountCreateOrConnectWithoutAuthInput
    connect?: StAccountWhereUniqueInput
  }

  export type TAccountUncheckedCreateNestedOneWithoutAuthInput = {
    create?: XOR<TAccountCreateWithoutAuthInput, TAccountUncheckedCreateWithoutAuthInput>
    connectOrCreate?: TAccountCreateOrConnectWithoutAuthInput
    connect?: TAccountWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StAccountUpdateOneWithoutAuthNestedInput = {
    create?: XOR<StAccountCreateWithoutAuthInput, StAccountUncheckedCreateWithoutAuthInput>
    connectOrCreate?: StAccountCreateOrConnectWithoutAuthInput
    upsert?: StAccountUpsertWithoutAuthInput
    disconnect?: StAccountWhereInput | boolean
    delete?: StAccountWhereInput | boolean
    connect?: StAccountWhereUniqueInput
    update?: XOR<XOR<StAccountUpdateToOneWithWhereWithoutAuthInput, StAccountUpdateWithoutAuthInput>, StAccountUncheckedUpdateWithoutAuthInput>
  }

  export type TAccountUpdateOneWithoutAuthNestedInput = {
    create?: XOR<TAccountCreateWithoutAuthInput, TAccountUncheckedCreateWithoutAuthInput>
    connectOrCreate?: TAccountCreateOrConnectWithoutAuthInput
    upsert?: TAccountUpsertWithoutAuthInput
    disconnect?: TAccountWhereInput | boolean
    delete?: TAccountWhereInput | boolean
    connect?: TAccountWhereUniqueInput
    update?: XOR<XOR<TAccountUpdateToOneWithWhereWithoutAuthInput, TAccountUpdateWithoutAuthInput>, TAccountUncheckedUpdateWithoutAuthInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StAccountUncheckedUpdateOneWithoutAuthNestedInput = {
    create?: XOR<StAccountCreateWithoutAuthInput, StAccountUncheckedCreateWithoutAuthInput>
    connectOrCreate?: StAccountCreateOrConnectWithoutAuthInput
    upsert?: StAccountUpsertWithoutAuthInput
    disconnect?: StAccountWhereInput | boolean
    delete?: StAccountWhereInput | boolean
    connect?: StAccountWhereUniqueInput
    update?: XOR<XOR<StAccountUpdateToOneWithWhereWithoutAuthInput, StAccountUpdateWithoutAuthInput>, StAccountUncheckedUpdateWithoutAuthInput>
  }

  export type TAccountUncheckedUpdateOneWithoutAuthNestedInput = {
    create?: XOR<TAccountCreateWithoutAuthInput, TAccountUncheckedCreateWithoutAuthInput>
    connectOrCreate?: TAccountCreateOrConnectWithoutAuthInput
    upsert?: TAccountUpsertWithoutAuthInput
    disconnect?: TAccountWhereInput | boolean
    delete?: TAccountWhereInput | boolean
    connect?: TAccountWhereUniqueInput
    update?: XOR<XOR<TAccountUpdateToOneWithWhereWithoutAuthInput, TAccountUpdateWithoutAuthInput>, TAccountUncheckedUpdateWithoutAuthInput>
  }

  export type AuthCreateNestedOneWithoutStudentInput = {
    create?: XOR<AuthCreateWithoutStudentInput, AuthUncheckedCreateWithoutStudentInput>
    connectOrCreate?: AuthCreateOrConnectWithoutStudentInput
    connect?: AuthWhereUniqueInput
  }

  export type PlanRecordCreateNestedManyWithoutStudentInput = {
    create?: XOR<PlanRecordCreateWithoutStudentInput, PlanRecordUncheckedCreateWithoutStudentInput> | PlanRecordCreateWithoutStudentInput[] | PlanRecordUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PlanRecordCreateOrConnectWithoutStudentInput | PlanRecordCreateOrConnectWithoutStudentInput[]
    createMany?: PlanRecordCreateManyStudentInputEnvelope
    connect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
  }

  export type ClassRecordCreateNestedManyWithoutStudentInput = {
    create?: XOR<ClassRecordCreateWithoutStudentInput, ClassRecordUncheckedCreateWithoutStudentInput> | ClassRecordCreateWithoutStudentInput[] | ClassRecordUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutStudentInput | ClassRecordCreateOrConnectWithoutStudentInput[]
    createMany?: ClassRecordCreateManyStudentInputEnvelope
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
  }

  export type PlanRecordUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<PlanRecordCreateWithoutStudentInput, PlanRecordUncheckedCreateWithoutStudentInput> | PlanRecordCreateWithoutStudentInput[] | PlanRecordUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PlanRecordCreateOrConnectWithoutStudentInput | PlanRecordCreateOrConnectWithoutStudentInput[]
    createMany?: PlanRecordCreateManyStudentInputEnvelope
    connect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
  }

  export type ClassRecordUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<ClassRecordCreateWithoutStudentInput, ClassRecordUncheckedCreateWithoutStudentInput> | ClassRecordCreateWithoutStudentInput[] | ClassRecordUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutStudentInput | ClassRecordCreateOrConnectWithoutStudentInput[]
    createMany?: ClassRecordCreateManyStudentInputEnvelope
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AuthUpdateOneRequiredWithoutStudentNestedInput = {
    create?: XOR<AuthCreateWithoutStudentInput, AuthUncheckedCreateWithoutStudentInput>
    connectOrCreate?: AuthCreateOrConnectWithoutStudentInput
    upsert?: AuthUpsertWithoutStudentInput
    connect?: AuthWhereUniqueInput
    update?: XOR<XOR<AuthUpdateToOneWithWhereWithoutStudentInput, AuthUpdateWithoutStudentInput>, AuthUncheckedUpdateWithoutStudentInput>
  }

  export type PlanRecordUpdateManyWithoutStudentNestedInput = {
    create?: XOR<PlanRecordCreateWithoutStudentInput, PlanRecordUncheckedCreateWithoutStudentInput> | PlanRecordCreateWithoutStudentInput[] | PlanRecordUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PlanRecordCreateOrConnectWithoutStudentInput | PlanRecordCreateOrConnectWithoutStudentInput[]
    upsert?: PlanRecordUpsertWithWhereUniqueWithoutStudentInput | PlanRecordUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: PlanRecordCreateManyStudentInputEnvelope
    set?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    disconnect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    delete?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    connect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    update?: PlanRecordUpdateWithWhereUniqueWithoutStudentInput | PlanRecordUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: PlanRecordUpdateManyWithWhereWithoutStudentInput | PlanRecordUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: PlanRecordScalarWhereInput | PlanRecordScalarWhereInput[]
  }

  export type ClassRecordUpdateManyWithoutStudentNestedInput = {
    create?: XOR<ClassRecordCreateWithoutStudentInput, ClassRecordUncheckedCreateWithoutStudentInput> | ClassRecordCreateWithoutStudentInput[] | ClassRecordUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutStudentInput | ClassRecordCreateOrConnectWithoutStudentInput[]
    upsert?: ClassRecordUpsertWithWhereUniqueWithoutStudentInput | ClassRecordUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: ClassRecordCreateManyStudentInputEnvelope
    set?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    disconnect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    delete?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    update?: ClassRecordUpdateWithWhereUniqueWithoutStudentInput | ClassRecordUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: ClassRecordUpdateManyWithWhereWithoutStudentInput | ClassRecordUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: ClassRecordScalarWhereInput | ClassRecordScalarWhereInput[]
  }

  export type PlanRecordUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<PlanRecordCreateWithoutStudentInput, PlanRecordUncheckedCreateWithoutStudentInput> | PlanRecordCreateWithoutStudentInput[] | PlanRecordUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PlanRecordCreateOrConnectWithoutStudentInput | PlanRecordCreateOrConnectWithoutStudentInput[]
    upsert?: PlanRecordUpsertWithWhereUniqueWithoutStudentInput | PlanRecordUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: PlanRecordCreateManyStudentInputEnvelope
    set?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    disconnect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    delete?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    connect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    update?: PlanRecordUpdateWithWhereUniqueWithoutStudentInput | PlanRecordUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: PlanRecordUpdateManyWithWhereWithoutStudentInput | PlanRecordUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: PlanRecordScalarWhereInput | PlanRecordScalarWhereInput[]
  }

  export type ClassRecordUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<ClassRecordCreateWithoutStudentInput, ClassRecordUncheckedCreateWithoutStudentInput> | ClassRecordCreateWithoutStudentInput[] | ClassRecordUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutStudentInput | ClassRecordCreateOrConnectWithoutStudentInput[]
    upsert?: ClassRecordUpsertWithWhereUniqueWithoutStudentInput | ClassRecordUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: ClassRecordCreateManyStudentInputEnvelope
    set?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    disconnect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    delete?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    update?: ClassRecordUpdateWithWhereUniqueWithoutStudentInput | ClassRecordUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: ClassRecordUpdateManyWithWhereWithoutStudentInput | ClassRecordUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: ClassRecordScalarWhereInput | ClassRecordScalarWhereInput[]
  }

  export type TAccountCreateNestedManyWithoutSpecsInput = {
    create?: XOR<TAccountCreateWithoutSpecsInput, TAccountUncheckedCreateWithoutSpecsInput> | TAccountCreateWithoutSpecsInput[] | TAccountUncheckedCreateWithoutSpecsInput[]
    connectOrCreate?: TAccountCreateOrConnectWithoutSpecsInput | TAccountCreateOrConnectWithoutSpecsInput[]
    connect?: TAccountWhereUniqueInput | TAccountWhereUniqueInput[]
  }

  export type TAccountUncheckedCreateNestedManyWithoutSpecsInput = {
    create?: XOR<TAccountCreateWithoutSpecsInput, TAccountUncheckedCreateWithoutSpecsInput> | TAccountCreateWithoutSpecsInput[] | TAccountUncheckedCreateWithoutSpecsInput[]
    connectOrCreate?: TAccountCreateOrConnectWithoutSpecsInput | TAccountCreateOrConnectWithoutSpecsInput[]
    connect?: TAccountWhereUniqueInput | TAccountWhereUniqueInput[]
  }

  export type TAccountUpdateManyWithoutSpecsNestedInput = {
    create?: XOR<TAccountCreateWithoutSpecsInput, TAccountUncheckedCreateWithoutSpecsInput> | TAccountCreateWithoutSpecsInput[] | TAccountUncheckedCreateWithoutSpecsInput[]
    connectOrCreate?: TAccountCreateOrConnectWithoutSpecsInput | TAccountCreateOrConnectWithoutSpecsInput[]
    upsert?: TAccountUpsertWithWhereUniqueWithoutSpecsInput | TAccountUpsertWithWhereUniqueWithoutSpecsInput[]
    set?: TAccountWhereUniqueInput | TAccountWhereUniqueInput[]
    disconnect?: TAccountWhereUniqueInput | TAccountWhereUniqueInput[]
    delete?: TAccountWhereUniqueInput | TAccountWhereUniqueInput[]
    connect?: TAccountWhereUniqueInput | TAccountWhereUniqueInput[]
    update?: TAccountUpdateWithWhereUniqueWithoutSpecsInput | TAccountUpdateWithWhereUniqueWithoutSpecsInput[]
    updateMany?: TAccountUpdateManyWithWhereWithoutSpecsInput | TAccountUpdateManyWithWhereWithoutSpecsInput[]
    deleteMany?: TAccountScalarWhereInput | TAccountScalarWhereInput[]
  }

  export type TAccountUncheckedUpdateManyWithoutSpecsNestedInput = {
    create?: XOR<TAccountCreateWithoutSpecsInput, TAccountUncheckedCreateWithoutSpecsInput> | TAccountCreateWithoutSpecsInput[] | TAccountUncheckedCreateWithoutSpecsInput[]
    connectOrCreate?: TAccountCreateOrConnectWithoutSpecsInput | TAccountCreateOrConnectWithoutSpecsInput[]
    upsert?: TAccountUpsertWithWhereUniqueWithoutSpecsInput | TAccountUpsertWithWhereUniqueWithoutSpecsInput[]
    set?: TAccountWhereUniqueInput | TAccountWhereUniqueInput[]
    disconnect?: TAccountWhereUniqueInput | TAccountWhereUniqueInput[]
    delete?: TAccountWhereUniqueInput | TAccountWhereUniqueInput[]
    connect?: TAccountWhereUniqueInput | TAccountWhereUniqueInput[]
    update?: TAccountUpdateWithWhereUniqueWithoutSpecsInput | TAccountUpdateWithWhereUniqueWithoutSpecsInput[]
    updateMany?: TAccountUpdateManyWithWhereWithoutSpecsInput | TAccountUpdateManyWithWhereWithoutSpecsInput[]
    deleteMany?: TAccountScalarWhereInput | TAccountScalarWhereInput[]
  }

  export type AuthCreateNestedOneWithoutTeacherInput = {
    create?: XOR<AuthCreateWithoutTeacherInput, AuthUncheckedCreateWithoutTeacherInput>
    connectOrCreate?: AuthCreateOrConnectWithoutTeacherInput
    connect?: AuthWhereUniqueInput
  }

  export type SpecializationCreateNestedManyWithoutTeachersInput = {
    create?: XOR<SpecializationCreateWithoutTeachersInput, SpecializationUncheckedCreateWithoutTeachersInput> | SpecializationCreateWithoutTeachersInput[] | SpecializationUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: SpecializationCreateOrConnectWithoutTeachersInput | SpecializationCreateOrConnectWithoutTeachersInput[]
    connect?: SpecializationWhereUniqueInput | SpecializationWhereUniqueInput[]
  }

  export type ClassRecordCreateNestedManyWithoutTeacherInput = {
    create?: XOR<ClassRecordCreateWithoutTeacherInput, ClassRecordUncheckedCreateWithoutTeacherInput> | ClassRecordCreateWithoutTeacherInput[] | ClassRecordUncheckedCreateWithoutTeacherInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutTeacherInput | ClassRecordCreateOrConnectWithoutTeacherInput[]
    createMany?: ClassRecordCreateManyTeacherInputEnvelope
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
  }

  export type SpecializationUncheckedCreateNestedManyWithoutTeachersInput = {
    create?: XOR<SpecializationCreateWithoutTeachersInput, SpecializationUncheckedCreateWithoutTeachersInput> | SpecializationCreateWithoutTeachersInput[] | SpecializationUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: SpecializationCreateOrConnectWithoutTeachersInput | SpecializationCreateOrConnectWithoutTeachersInput[]
    connect?: SpecializationWhereUniqueInput | SpecializationWhereUniqueInput[]
  }

  export type ClassRecordUncheckedCreateNestedManyWithoutTeacherInput = {
    create?: XOR<ClassRecordCreateWithoutTeacherInput, ClassRecordUncheckedCreateWithoutTeacherInput> | ClassRecordCreateWithoutTeacherInput[] | ClassRecordUncheckedCreateWithoutTeacherInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutTeacherInput | ClassRecordCreateOrConnectWithoutTeacherInput[]
    createMany?: ClassRecordCreateManyTeacherInputEnvelope
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AuthUpdateOneRequiredWithoutTeacherNestedInput = {
    create?: XOR<AuthCreateWithoutTeacherInput, AuthUncheckedCreateWithoutTeacherInput>
    connectOrCreate?: AuthCreateOrConnectWithoutTeacherInput
    upsert?: AuthUpsertWithoutTeacherInput
    connect?: AuthWhereUniqueInput
    update?: XOR<XOR<AuthUpdateToOneWithWhereWithoutTeacherInput, AuthUpdateWithoutTeacherInput>, AuthUncheckedUpdateWithoutTeacherInput>
  }

  export type SpecializationUpdateManyWithoutTeachersNestedInput = {
    create?: XOR<SpecializationCreateWithoutTeachersInput, SpecializationUncheckedCreateWithoutTeachersInput> | SpecializationCreateWithoutTeachersInput[] | SpecializationUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: SpecializationCreateOrConnectWithoutTeachersInput | SpecializationCreateOrConnectWithoutTeachersInput[]
    upsert?: SpecializationUpsertWithWhereUniqueWithoutTeachersInput | SpecializationUpsertWithWhereUniqueWithoutTeachersInput[]
    set?: SpecializationWhereUniqueInput | SpecializationWhereUniqueInput[]
    disconnect?: SpecializationWhereUniqueInput | SpecializationWhereUniqueInput[]
    delete?: SpecializationWhereUniqueInput | SpecializationWhereUniqueInput[]
    connect?: SpecializationWhereUniqueInput | SpecializationWhereUniqueInput[]
    update?: SpecializationUpdateWithWhereUniqueWithoutTeachersInput | SpecializationUpdateWithWhereUniqueWithoutTeachersInput[]
    updateMany?: SpecializationUpdateManyWithWhereWithoutTeachersInput | SpecializationUpdateManyWithWhereWithoutTeachersInput[]
    deleteMany?: SpecializationScalarWhereInput | SpecializationScalarWhereInput[]
  }

  export type ClassRecordUpdateManyWithoutTeacherNestedInput = {
    create?: XOR<ClassRecordCreateWithoutTeacherInput, ClassRecordUncheckedCreateWithoutTeacherInput> | ClassRecordCreateWithoutTeacherInput[] | ClassRecordUncheckedCreateWithoutTeacherInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutTeacherInput | ClassRecordCreateOrConnectWithoutTeacherInput[]
    upsert?: ClassRecordUpsertWithWhereUniqueWithoutTeacherInput | ClassRecordUpsertWithWhereUniqueWithoutTeacherInput[]
    createMany?: ClassRecordCreateManyTeacherInputEnvelope
    set?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    disconnect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    delete?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    update?: ClassRecordUpdateWithWhereUniqueWithoutTeacherInput | ClassRecordUpdateWithWhereUniqueWithoutTeacherInput[]
    updateMany?: ClassRecordUpdateManyWithWhereWithoutTeacherInput | ClassRecordUpdateManyWithWhereWithoutTeacherInput[]
    deleteMany?: ClassRecordScalarWhereInput | ClassRecordScalarWhereInput[]
  }

  export type SpecializationUncheckedUpdateManyWithoutTeachersNestedInput = {
    create?: XOR<SpecializationCreateWithoutTeachersInput, SpecializationUncheckedCreateWithoutTeachersInput> | SpecializationCreateWithoutTeachersInput[] | SpecializationUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: SpecializationCreateOrConnectWithoutTeachersInput | SpecializationCreateOrConnectWithoutTeachersInput[]
    upsert?: SpecializationUpsertWithWhereUniqueWithoutTeachersInput | SpecializationUpsertWithWhereUniqueWithoutTeachersInput[]
    set?: SpecializationWhereUniqueInput | SpecializationWhereUniqueInput[]
    disconnect?: SpecializationWhereUniqueInput | SpecializationWhereUniqueInput[]
    delete?: SpecializationWhereUniqueInput | SpecializationWhereUniqueInput[]
    connect?: SpecializationWhereUniqueInput | SpecializationWhereUniqueInput[]
    update?: SpecializationUpdateWithWhereUniqueWithoutTeachersInput | SpecializationUpdateWithWhereUniqueWithoutTeachersInput[]
    updateMany?: SpecializationUpdateManyWithWhereWithoutTeachersInput | SpecializationUpdateManyWithWhereWithoutTeachersInput[]
    deleteMany?: SpecializationScalarWhereInput | SpecializationScalarWhereInput[]
  }

  export type ClassRecordUncheckedUpdateManyWithoutTeacherNestedInput = {
    create?: XOR<ClassRecordCreateWithoutTeacherInput, ClassRecordUncheckedCreateWithoutTeacherInput> | ClassRecordCreateWithoutTeacherInput[] | ClassRecordUncheckedCreateWithoutTeacherInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutTeacherInput | ClassRecordCreateOrConnectWithoutTeacherInput[]
    upsert?: ClassRecordUpsertWithWhereUniqueWithoutTeacherInput | ClassRecordUpsertWithWhereUniqueWithoutTeacherInput[]
    createMany?: ClassRecordCreateManyTeacherInputEnvelope
    set?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    disconnect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    delete?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    update?: ClassRecordUpdateWithWhereUniqueWithoutTeacherInput | ClassRecordUpdateWithWhereUniqueWithoutTeacherInput[]
    updateMany?: ClassRecordUpdateManyWithWhereWithoutTeacherInput | ClassRecordUpdateManyWithWhereWithoutTeacherInput[]
    deleteMany?: ClassRecordScalarWhereInput | ClassRecordScalarWhereInput[]
  }

  export type PlanRecordCreateNestedManyWithoutPlanInput = {
    create?: XOR<PlanRecordCreateWithoutPlanInput, PlanRecordUncheckedCreateWithoutPlanInput> | PlanRecordCreateWithoutPlanInput[] | PlanRecordUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: PlanRecordCreateOrConnectWithoutPlanInput | PlanRecordCreateOrConnectWithoutPlanInput[]
    createMany?: PlanRecordCreateManyPlanInputEnvelope
    connect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
  }

  export type PlanRecordUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<PlanRecordCreateWithoutPlanInput, PlanRecordUncheckedCreateWithoutPlanInput> | PlanRecordCreateWithoutPlanInput[] | PlanRecordUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: PlanRecordCreateOrConnectWithoutPlanInput | PlanRecordCreateOrConnectWithoutPlanInput[]
    createMany?: PlanRecordCreateManyPlanInputEnvelope
    connect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PlanRecordUpdateManyWithoutPlanNestedInput = {
    create?: XOR<PlanRecordCreateWithoutPlanInput, PlanRecordUncheckedCreateWithoutPlanInput> | PlanRecordCreateWithoutPlanInput[] | PlanRecordUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: PlanRecordCreateOrConnectWithoutPlanInput | PlanRecordCreateOrConnectWithoutPlanInput[]
    upsert?: PlanRecordUpsertWithWhereUniqueWithoutPlanInput | PlanRecordUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: PlanRecordCreateManyPlanInputEnvelope
    set?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    disconnect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    delete?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    connect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    update?: PlanRecordUpdateWithWhereUniqueWithoutPlanInput | PlanRecordUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: PlanRecordUpdateManyWithWhereWithoutPlanInput | PlanRecordUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: PlanRecordScalarWhereInput | PlanRecordScalarWhereInput[]
  }

  export type PlanRecordUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<PlanRecordCreateWithoutPlanInput, PlanRecordUncheckedCreateWithoutPlanInput> | PlanRecordCreateWithoutPlanInput[] | PlanRecordUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: PlanRecordCreateOrConnectWithoutPlanInput | PlanRecordCreateOrConnectWithoutPlanInput[]
    upsert?: PlanRecordUpsertWithWhereUniqueWithoutPlanInput | PlanRecordUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: PlanRecordCreateManyPlanInputEnvelope
    set?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    disconnect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    delete?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    connect?: PlanRecordWhereUniqueInput | PlanRecordWhereUniqueInput[]
    update?: PlanRecordUpdateWithWhereUniqueWithoutPlanInput | PlanRecordUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: PlanRecordUpdateManyWithWhereWithoutPlanInput | PlanRecordUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: PlanRecordScalarWhereInput | PlanRecordScalarWhereInput[]
  }

  export type StAccountCreateNestedOneWithoutPlansInput = {
    create?: XOR<StAccountCreateWithoutPlansInput, StAccountUncheckedCreateWithoutPlansInput>
    connectOrCreate?: StAccountCreateOrConnectWithoutPlansInput
    connect?: StAccountWhereUniqueInput
  }

  export type PlanDescCreateNestedOneWithoutRecordsInput = {
    create?: XOR<PlanDescCreateWithoutRecordsInput, PlanDescUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: PlanDescCreateOrConnectWithoutRecordsInput
    connect?: PlanDescWhereUniqueInput
  }

  export type ClassRecordCreateNestedManyWithoutPlanRecordInput = {
    create?: XOR<ClassRecordCreateWithoutPlanRecordInput, ClassRecordUncheckedCreateWithoutPlanRecordInput> | ClassRecordCreateWithoutPlanRecordInput[] | ClassRecordUncheckedCreateWithoutPlanRecordInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutPlanRecordInput | ClassRecordCreateOrConnectWithoutPlanRecordInput[]
    createMany?: ClassRecordCreateManyPlanRecordInputEnvelope
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
  }

  export type ClassRecordUncheckedCreateNestedManyWithoutPlanRecordInput = {
    create?: XOR<ClassRecordCreateWithoutPlanRecordInput, ClassRecordUncheckedCreateWithoutPlanRecordInput> | ClassRecordCreateWithoutPlanRecordInput[] | ClassRecordUncheckedCreateWithoutPlanRecordInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutPlanRecordInput | ClassRecordCreateOrConnectWithoutPlanRecordInput[]
    createMany?: ClassRecordCreateManyPlanRecordInputEnvelope
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
  }

  export type StAccountUpdateOneRequiredWithoutPlansNestedInput = {
    create?: XOR<StAccountCreateWithoutPlansInput, StAccountUncheckedCreateWithoutPlansInput>
    connectOrCreate?: StAccountCreateOrConnectWithoutPlansInput
    upsert?: StAccountUpsertWithoutPlansInput
    connect?: StAccountWhereUniqueInput
    update?: XOR<XOR<StAccountUpdateToOneWithWhereWithoutPlansInput, StAccountUpdateWithoutPlansInput>, StAccountUncheckedUpdateWithoutPlansInput>
  }

  export type PlanDescUpdateOneRequiredWithoutRecordsNestedInput = {
    create?: XOR<PlanDescCreateWithoutRecordsInput, PlanDescUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: PlanDescCreateOrConnectWithoutRecordsInput
    upsert?: PlanDescUpsertWithoutRecordsInput
    connect?: PlanDescWhereUniqueInput
    update?: XOR<XOR<PlanDescUpdateToOneWithWhereWithoutRecordsInput, PlanDescUpdateWithoutRecordsInput>, PlanDescUncheckedUpdateWithoutRecordsInput>
  }

  export type ClassRecordUpdateManyWithoutPlanRecordNestedInput = {
    create?: XOR<ClassRecordCreateWithoutPlanRecordInput, ClassRecordUncheckedCreateWithoutPlanRecordInput> | ClassRecordCreateWithoutPlanRecordInput[] | ClassRecordUncheckedCreateWithoutPlanRecordInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutPlanRecordInput | ClassRecordCreateOrConnectWithoutPlanRecordInput[]
    upsert?: ClassRecordUpsertWithWhereUniqueWithoutPlanRecordInput | ClassRecordUpsertWithWhereUniqueWithoutPlanRecordInput[]
    createMany?: ClassRecordCreateManyPlanRecordInputEnvelope
    set?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    disconnect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    delete?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    update?: ClassRecordUpdateWithWhereUniqueWithoutPlanRecordInput | ClassRecordUpdateWithWhereUniqueWithoutPlanRecordInput[]
    updateMany?: ClassRecordUpdateManyWithWhereWithoutPlanRecordInput | ClassRecordUpdateManyWithWhereWithoutPlanRecordInput[]
    deleteMany?: ClassRecordScalarWhereInput | ClassRecordScalarWhereInput[]
  }

  export type ClassRecordUncheckedUpdateManyWithoutPlanRecordNestedInput = {
    create?: XOR<ClassRecordCreateWithoutPlanRecordInput, ClassRecordUncheckedCreateWithoutPlanRecordInput> | ClassRecordCreateWithoutPlanRecordInput[] | ClassRecordUncheckedCreateWithoutPlanRecordInput[]
    connectOrCreate?: ClassRecordCreateOrConnectWithoutPlanRecordInput | ClassRecordCreateOrConnectWithoutPlanRecordInput[]
    upsert?: ClassRecordUpsertWithWhereUniqueWithoutPlanRecordInput | ClassRecordUpsertWithWhereUniqueWithoutPlanRecordInput[]
    createMany?: ClassRecordCreateManyPlanRecordInputEnvelope
    set?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    disconnect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    delete?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    connect?: ClassRecordWhereUniqueInput | ClassRecordWhereUniqueInput[]
    update?: ClassRecordUpdateWithWhereUniqueWithoutPlanRecordInput | ClassRecordUpdateWithWhereUniqueWithoutPlanRecordInput[]
    updateMany?: ClassRecordUpdateManyWithWhereWithoutPlanRecordInput | ClassRecordUpdateManyWithWhereWithoutPlanRecordInput[]
    deleteMany?: ClassRecordScalarWhereInput | ClassRecordScalarWhereInput[]
  }

  export type TAccountCreateNestedOneWithoutClassesInput = {
    create?: XOR<TAccountCreateWithoutClassesInput, TAccountUncheckedCreateWithoutClassesInput>
    connectOrCreate?: TAccountCreateOrConnectWithoutClassesInput
    connect?: TAccountWhereUniqueInput
  }

  export type StAccountCreateNestedOneWithoutClassesInput = {
    create?: XOR<StAccountCreateWithoutClassesInput, StAccountUncheckedCreateWithoutClassesInput>
    connectOrCreate?: StAccountCreateOrConnectWithoutClassesInput
    connect?: StAccountWhereUniqueInput
  }

  export type PlanRecordCreateNestedOneWithoutClassesInput = {
    create?: XOR<PlanRecordCreateWithoutClassesInput, PlanRecordUncheckedCreateWithoutClassesInput>
    connectOrCreate?: PlanRecordCreateOrConnectWithoutClassesInput
    connect?: PlanRecordWhereUniqueInput
  }

  export type TAccountUpdateOneRequiredWithoutClassesNestedInput = {
    create?: XOR<TAccountCreateWithoutClassesInput, TAccountUncheckedCreateWithoutClassesInput>
    connectOrCreate?: TAccountCreateOrConnectWithoutClassesInput
    upsert?: TAccountUpsertWithoutClassesInput
    connect?: TAccountWhereUniqueInput
    update?: XOR<XOR<TAccountUpdateToOneWithWhereWithoutClassesInput, TAccountUpdateWithoutClassesInput>, TAccountUncheckedUpdateWithoutClassesInput>
  }

  export type StAccountUpdateOneRequiredWithoutClassesNestedInput = {
    create?: XOR<StAccountCreateWithoutClassesInput, StAccountUncheckedCreateWithoutClassesInput>
    connectOrCreate?: StAccountCreateOrConnectWithoutClassesInput
    upsert?: StAccountUpsertWithoutClassesInput
    connect?: StAccountWhereUniqueInput
    update?: XOR<XOR<StAccountUpdateToOneWithWhereWithoutClassesInput, StAccountUpdateWithoutClassesInput>, StAccountUncheckedUpdateWithoutClassesInput>
  }

  export type PlanRecordUpdateOneRequiredWithoutClassesNestedInput = {
    create?: XOR<PlanRecordCreateWithoutClassesInput, PlanRecordUncheckedCreateWithoutClassesInput>
    connectOrCreate?: PlanRecordCreateOrConnectWithoutClassesInput
    upsert?: PlanRecordUpsertWithoutClassesInput
    connect?: PlanRecordWhereUniqueInput
    update?: XOR<XOR<PlanRecordUpdateToOneWithWhereWithoutClassesInput, PlanRecordUpdateWithoutClassesInput>, PlanRecordUncheckedUpdateWithoutClassesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type StAccountCreateWithoutAuthInput = {
    name: string
    is_demo?: boolean
    updated_at?: Date | string | null
    plans?: PlanRecordCreateNestedManyWithoutStudentInput
    classes?: ClassRecordCreateNestedManyWithoutStudentInput
  }

  export type StAccountUncheckedCreateWithoutAuthInput = {
    s_id?: number
    name: string
    is_demo?: boolean
    updated_at?: Date | string | null
    plans?: PlanRecordUncheckedCreateNestedManyWithoutStudentInput
    classes?: ClassRecordUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StAccountCreateOrConnectWithoutAuthInput = {
    where: StAccountWhereUniqueInput
    create: XOR<StAccountCreateWithoutAuthInput, StAccountUncheckedCreateWithoutAuthInput>
  }

  export type TAccountCreateWithoutAuthInput = {
    name: string
    bio?: string | null
    rating?: number | null
    updated_at?: Date | string | null
    specs?: SpecializationCreateNestedManyWithoutTeachersInput
    classes?: ClassRecordCreateNestedManyWithoutTeacherInput
  }

  export type TAccountUncheckedCreateWithoutAuthInput = {
    t_id?: number
    name: string
    bio?: string | null
    rating?: number | null
    updated_at?: Date | string | null
    specs?: SpecializationUncheckedCreateNestedManyWithoutTeachersInput
    classes?: ClassRecordUncheckedCreateNestedManyWithoutTeacherInput
  }

  export type TAccountCreateOrConnectWithoutAuthInput = {
    where: TAccountWhereUniqueInput
    create: XOR<TAccountCreateWithoutAuthInput, TAccountUncheckedCreateWithoutAuthInput>
  }

  export type StAccountUpsertWithoutAuthInput = {
    update: XOR<StAccountUpdateWithoutAuthInput, StAccountUncheckedUpdateWithoutAuthInput>
    create: XOR<StAccountCreateWithoutAuthInput, StAccountUncheckedCreateWithoutAuthInput>
    where?: StAccountWhereInput
  }

  export type StAccountUpdateToOneWithWhereWithoutAuthInput = {
    where?: StAccountWhereInput
    data: XOR<StAccountUpdateWithoutAuthInput, StAccountUncheckedUpdateWithoutAuthInput>
  }

  export type StAccountUpdateWithoutAuthInput = {
    name?: StringFieldUpdateOperationsInput | string
    is_demo?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plans?: PlanRecordUpdateManyWithoutStudentNestedInput
    classes?: ClassRecordUpdateManyWithoutStudentNestedInput
  }

  export type StAccountUncheckedUpdateWithoutAuthInput = {
    s_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    is_demo?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plans?: PlanRecordUncheckedUpdateManyWithoutStudentNestedInput
    classes?: ClassRecordUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type TAccountUpsertWithoutAuthInput = {
    update: XOR<TAccountUpdateWithoutAuthInput, TAccountUncheckedUpdateWithoutAuthInput>
    create: XOR<TAccountCreateWithoutAuthInput, TAccountUncheckedCreateWithoutAuthInput>
    where?: TAccountWhereInput
  }

  export type TAccountUpdateToOneWithWhereWithoutAuthInput = {
    where?: TAccountWhereInput
    data: XOR<TAccountUpdateWithoutAuthInput, TAccountUncheckedUpdateWithoutAuthInput>
  }

  export type TAccountUpdateWithoutAuthInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    specs?: SpecializationUpdateManyWithoutTeachersNestedInput
    classes?: ClassRecordUpdateManyWithoutTeacherNestedInput
  }

  export type TAccountUncheckedUpdateWithoutAuthInput = {
    t_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    specs?: SpecializationUncheckedUpdateManyWithoutTeachersNestedInput
    classes?: ClassRecordUncheckedUpdateManyWithoutTeacherNestedInput
  }

  export type AuthCreateWithoutStudentInput = {
    mail: string
    password: string
    username?: string | null
    createdAt?: Date | string
    teacher?: TAccountCreateNestedOneWithoutAuthInput
  }

  export type AuthUncheckedCreateWithoutStudentInput = {
    auth_id?: number
    mail: string
    password: string
    username?: string | null
    createdAt?: Date | string
    teacher?: TAccountUncheckedCreateNestedOneWithoutAuthInput
  }

  export type AuthCreateOrConnectWithoutStudentInput = {
    where: AuthWhereUniqueInput
    create: XOR<AuthCreateWithoutStudentInput, AuthUncheckedCreateWithoutStudentInput>
  }

  export type PlanRecordCreateWithoutStudentInput = {
    joinAt?: Date | string
    sessionsRem: number
    isValid?: boolean
    plan: PlanDescCreateNestedOneWithoutRecordsInput
    classes?: ClassRecordCreateNestedManyWithoutPlanRecordInput
  }

  export type PlanRecordUncheckedCreateWithoutStudentInput = {
    record_no?: number
    plan_id: number
    joinAt?: Date | string
    sessionsRem: number
    isValid?: boolean
    classes?: ClassRecordUncheckedCreateNestedManyWithoutPlanRecordInput
  }

  export type PlanRecordCreateOrConnectWithoutStudentInput = {
    where: PlanRecordWhereUniqueInput
    create: XOR<PlanRecordCreateWithoutStudentInput, PlanRecordUncheckedCreateWithoutStudentInput>
  }

  export type PlanRecordCreateManyStudentInputEnvelope = {
    data: PlanRecordCreateManyStudentInput | PlanRecordCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type ClassRecordCreateWithoutStudentInput = {
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
    teacher: TAccountCreateNestedOneWithoutClassesInput
    planRecord: PlanRecordCreateNestedOneWithoutClassesInput
  }

  export type ClassRecordUncheckedCreateWithoutStudentInput = {
    record_no?: number
    t_id: number
    plan_record_id: number
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
  }

  export type ClassRecordCreateOrConnectWithoutStudentInput = {
    where: ClassRecordWhereUniqueInput
    create: XOR<ClassRecordCreateWithoutStudentInput, ClassRecordUncheckedCreateWithoutStudentInput>
  }

  export type ClassRecordCreateManyStudentInputEnvelope = {
    data: ClassRecordCreateManyStudentInput | ClassRecordCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type AuthUpsertWithoutStudentInput = {
    update: XOR<AuthUpdateWithoutStudentInput, AuthUncheckedUpdateWithoutStudentInput>
    create: XOR<AuthCreateWithoutStudentInput, AuthUncheckedCreateWithoutStudentInput>
    where?: AuthWhereInput
  }

  export type AuthUpdateToOneWithWhereWithoutStudentInput = {
    where?: AuthWhereInput
    data: XOR<AuthUpdateWithoutStudentInput, AuthUncheckedUpdateWithoutStudentInput>
  }

  export type AuthUpdateWithoutStudentInput = {
    mail?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teacher?: TAccountUpdateOneWithoutAuthNestedInput
  }

  export type AuthUncheckedUpdateWithoutStudentInput = {
    auth_id?: IntFieldUpdateOperationsInput | number
    mail?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teacher?: TAccountUncheckedUpdateOneWithoutAuthNestedInput
  }

  export type PlanRecordUpsertWithWhereUniqueWithoutStudentInput = {
    where: PlanRecordWhereUniqueInput
    update: XOR<PlanRecordUpdateWithoutStudentInput, PlanRecordUncheckedUpdateWithoutStudentInput>
    create: XOR<PlanRecordCreateWithoutStudentInput, PlanRecordUncheckedCreateWithoutStudentInput>
  }

  export type PlanRecordUpdateWithWhereUniqueWithoutStudentInput = {
    where: PlanRecordWhereUniqueInput
    data: XOR<PlanRecordUpdateWithoutStudentInput, PlanRecordUncheckedUpdateWithoutStudentInput>
  }

  export type PlanRecordUpdateManyWithWhereWithoutStudentInput = {
    where: PlanRecordScalarWhereInput
    data: XOR<PlanRecordUpdateManyMutationInput, PlanRecordUncheckedUpdateManyWithoutStudentInput>
  }

  export type PlanRecordScalarWhereInput = {
    AND?: PlanRecordScalarWhereInput | PlanRecordScalarWhereInput[]
    OR?: PlanRecordScalarWhereInput[]
    NOT?: PlanRecordScalarWhereInput | PlanRecordScalarWhereInput[]
    record_no?: IntFilter<"PlanRecord"> | number
    s_id?: IntFilter<"PlanRecord"> | number
    plan_id?: IntFilter<"PlanRecord"> | number
    joinAt?: DateTimeFilter<"PlanRecord"> | Date | string
    sessionsRem?: IntFilter<"PlanRecord"> | number
    isValid?: BoolFilter<"PlanRecord"> | boolean
  }

  export type ClassRecordUpsertWithWhereUniqueWithoutStudentInput = {
    where: ClassRecordWhereUniqueInput
    update: XOR<ClassRecordUpdateWithoutStudentInput, ClassRecordUncheckedUpdateWithoutStudentInput>
    create: XOR<ClassRecordCreateWithoutStudentInput, ClassRecordUncheckedCreateWithoutStudentInput>
  }

  export type ClassRecordUpdateWithWhereUniqueWithoutStudentInput = {
    where: ClassRecordWhereUniqueInput
    data: XOR<ClassRecordUpdateWithoutStudentInput, ClassRecordUncheckedUpdateWithoutStudentInput>
  }

  export type ClassRecordUpdateManyWithWhereWithoutStudentInput = {
    where: ClassRecordScalarWhereInput
    data: XOR<ClassRecordUpdateManyMutationInput, ClassRecordUncheckedUpdateManyWithoutStudentInput>
  }

  export type ClassRecordScalarWhereInput = {
    AND?: ClassRecordScalarWhereInput | ClassRecordScalarWhereInput[]
    OR?: ClassRecordScalarWhereInput[]
    NOT?: ClassRecordScalarWhereInput | ClassRecordScalarWhereInput[]
    record_no?: IntFilter<"ClassRecord"> | number
    t_id?: IntFilter<"ClassRecord"> | number
    s_id?: IntFilter<"ClassRecord"> | number
    plan_record_id?: IntFilter<"ClassRecord"> | number
    link?: StringNullableFilter<"ClassRecord"> | string | null
    startAt?: DateTimeFilter<"ClassRecord"> | Date | string
    endAt?: DateTimeNullableFilter<"ClassRecord"> | Date | string | null
  }

  export type TAccountCreateWithoutSpecsInput = {
    name: string
    bio?: string | null
    rating?: number | null
    updated_at?: Date | string | null
    auth: AuthCreateNestedOneWithoutTeacherInput
    classes?: ClassRecordCreateNestedManyWithoutTeacherInput
  }

  export type TAccountUncheckedCreateWithoutSpecsInput = {
    t_id?: number
    auth_id: number
    name: string
    bio?: string | null
    rating?: number | null
    updated_at?: Date | string | null
    classes?: ClassRecordUncheckedCreateNestedManyWithoutTeacherInput
  }

  export type TAccountCreateOrConnectWithoutSpecsInput = {
    where: TAccountWhereUniqueInput
    create: XOR<TAccountCreateWithoutSpecsInput, TAccountUncheckedCreateWithoutSpecsInput>
  }

  export type TAccountUpsertWithWhereUniqueWithoutSpecsInput = {
    where: TAccountWhereUniqueInput
    update: XOR<TAccountUpdateWithoutSpecsInput, TAccountUncheckedUpdateWithoutSpecsInput>
    create: XOR<TAccountCreateWithoutSpecsInput, TAccountUncheckedCreateWithoutSpecsInput>
  }

  export type TAccountUpdateWithWhereUniqueWithoutSpecsInput = {
    where: TAccountWhereUniqueInput
    data: XOR<TAccountUpdateWithoutSpecsInput, TAccountUncheckedUpdateWithoutSpecsInput>
  }

  export type TAccountUpdateManyWithWhereWithoutSpecsInput = {
    where: TAccountScalarWhereInput
    data: XOR<TAccountUpdateManyMutationInput, TAccountUncheckedUpdateManyWithoutSpecsInput>
  }

  export type TAccountScalarWhereInput = {
    AND?: TAccountScalarWhereInput | TAccountScalarWhereInput[]
    OR?: TAccountScalarWhereInput[]
    NOT?: TAccountScalarWhereInput | TAccountScalarWhereInput[]
    t_id?: IntFilter<"TAccount"> | number
    auth_id?: IntFilter<"TAccount"> | number
    name?: StringFilter<"TAccount"> | string
    bio?: StringNullableFilter<"TAccount"> | string | null
    rating?: FloatNullableFilter<"TAccount"> | number | null
    updated_at?: DateTimeNullableFilter<"TAccount"> | Date | string | null
  }

  export type AuthCreateWithoutTeacherInput = {
    mail: string
    password: string
    username?: string | null
    createdAt?: Date | string
    student?: StAccountCreateNestedOneWithoutAuthInput
  }

  export type AuthUncheckedCreateWithoutTeacherInput = {
    auth_id?: number
    mail: string
    password: string
    username?: string | null
    createdAt?: Date | string
    student?: StAccountUncheckedCreateNestedOneWithoutAuthInput
  }

  export type AuthCreateOrConnectWithoutTeacherInput = {
    where: AuthWhereUniqueInput
    create: XOR<AuthCreateWithoutTeacherInput, AuthUncheckedCreateWithoutTeacherInput>
  }

  export type SpecializationCreateWithoutTeachersInput = {
    name: string
  }

  export type SpecializationUncheckedCreateWithoutTeachersInput = {
    id?: number
    name: string
  }

  export type SpecializationCreateOrConnectWithoutTeachersInput = {
    where: SpecializationWhereUniqueInput
    create: XOR<SpecializationCreateWithoutTeachersInput, SpecializationUncheckedCreateWithoutTeachersInput>
  }

  export type ClassRecordCreateWithoutTeacherInput = {
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
    student: StAccountCreateNestedOneWithoutClassesInput
    planRecord: PlanRecordCreateNestedOneWithoutClassesInput
  }

  export type ClassRecordUncheckedCreateWithoutTeacherInput = {
    record_no?: number
    s_id: number
    plan_record_id: number
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
  }

  export type ClassRecordCreateOrConnectWithoutTeacherInput = {
    where: ClassRecordWhereUniqueInput
    create: XOR<ClassRecordCreateWithoutTeacherInput, ClassRecordUncheckedCreateWithoutTeacherInput>
  }

  export type ClassRecordCreateManyTeacherInputEnvelope = {
    data: ClassRecordCreateManyTeacherInput | ClassRecordCreateManyTeacherInput[]
    skipDuplicates?: boolean
  }

  export type AuthUpsertWithoutTeacherInput = {
    update: XOR<AuthUpdateWithoutTeacherInput, AuthUncheckedUpdateWithoutTeacherInput>
    create: XOR<AuthCreateWithoutTeacherInput, AuthUncheckedCreateWithoutTeacherInput>
    where?: AuthWhereInput
  }

  export type AuthUpdateToOneWithWhereWithoutTeacherInput = {
    where?: AuthWhereInput
    data: XOR<AuthUpdateWithoutTeacherInput, AuthUncheckedUpdateWithoutTeacherInput>
  }

  export type AuthUpdateWithoutTeacherInput = {
    mail?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StAccountUpdateOneWithoutAuthNestedInput
  }

  export type AuthUncheckedUpdateWithoutTeacherInput = {
    auth_id?: IntFieldUpdateOperationsInput | number
    mail?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StAccountUncheckedUpdateOneWithoutAuthNestedInput
  }

  export type SpecializationUpsertWithWhereUniqueWithoutTeachersInput = {
    where: SpecializationWhereUniqueInput
    update: XOR<SpecializationUpdateWithoutTeachersInput, SpecializationUncheckedUpdateWithoutTeachersInput>
    create: XOR<SpecializationCreateWithoutTeachersInput, SpecializationUncheckedCreateWithoutTeachersInput>
  }

  export type SpecializationUpdateWithWhereUniqueWithoutTeachersInput = {
    where: SpecializationWhereUniqueInput
    data: XOR<SpecializationUpdateWithoutTeachersInput, SpecializationUncheckedUpdateWithoutTeachersInput>
  }

  export type SpecializationUpdateManyWithWhereWithoutTeachersInput = {
    where: SpecializationScalarWhereInput
    data: XOR<SpecializationUpdateManyMutationInput, SpecializationUncheckedUpdateManyWithoutTeachersInput>
  }

  export type SpecializationScalarWhereInput = {
    AND?: SpecializationScalarWhereInput | SpecializationScalarWhereInput[]
    OR?: SpecializationScalarWhereInput[]
    NOT?: SpecializationScalarWhereInput | SpecializationScalarWhereInput[]
    id?: IntFilter<"Specialization"> | number
    name?: StringFilter<"Specialization"> | string
  }

  export type ClassRecordUpsertWithWhereUniqueWithoutTeacherInput = {
    where: ClassRecordWhereUniqueInput
    update: XOR<ClassRecordUpdateWithoutTeacherInput, ClassRecordUncheckedUpdateWithoutTeacherInput>
    create: XOR<ClassRecordCreateWithoutTeacherInput, ClassRecordUncheckedCreateWithoutTeacherInput>
  }

  export type ClassRecordUpdateWithWhereUniqueWithoutTeacherInput = {
    where: ClassRecordWhereUniqueInput
    data: XOR<ClassRecordUpdateWithoutTeacherInput, ClassRecordUncheckedUpdateWithoutTeacherInput>
  }

  export type ClassRecordUpdateManyWithWhereWithoutTeacherInput = {
    where: ClassRecordScalarWhereInput
    data: XOR<ClassRecordUpdateManyMutationInput, ClassRecordUncheckedUpdateManyWithoutTeacherInput>
  }

  export type PlanRecordCreateWithoutPlanInput = {
    joinAt?: Date | string
    sessionsRem: number
    isValid?: boolean
    student: StAccountCreateNestedOneWithoutPlansInput
    classes?: ClassRecordCreateNestedManyWithoutPlanRecordInput
  }

  export type PlanRecordUncheckedCreateWithoutPlanInput = {
    record_no?: number
    s_id: number
    joinAt?: Date | string
    sessionsRem: number
    isValid?: boolean
    classes?: ClassRecordUncheckedCreateNestedManyWithoutPlanRecordInput
  }

  export type PlanRecordCreateOrConnectWithoutPlanInput = {
    where: PlanRecordWhereUniqueInput
    create: XOR<PlanRecordCreateWithoutPlanInput, PlanRecordUncheckedCreateWithoutPlanInput>
  }

  export type PlanRecordCreateManyPlanInputEnvelope = {
    data: PlanRecordCreateManyPlanInput | PlanRecordCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type PlanRecordUpsertWithWhereUniqueWithoutPlanInput = {
    where: PlanRecordWhereUniqueInput
    update: XOR<PlanRecordUpdateWithoutPlanInput, PlanRecordUncheckedUpdateWithoutPlanInput>
    create: XOR<PlanRecordCreateWithoutPlanInput, PlanRecordUncheckedCreateWithoutPlanInput>
  }

  export type PlanRecordUpdateWithWhereUniqueWithoutPlanInput = {
    where: PlanRecordWhereUniqueInput
    data: XOR<PlanRecordUpdateWithoutPlanInput, PlanRecordUncheckedUpdateWithoutPlanInput>
  }

  export type PlanRecordUpdateManyWithWhereWithoutPlanInput = {
    where: PlanRecordScalarWhereInput
    data: XOR<PlanRecordUpdateManyMutationInput, PlanRecordUncheckedUpdateManyWithoutPlanInput>
  }

  export type StAccountCreateWithoutPlansInput = {
    name: string
    is_demo?: boolean
    updated_at?: Date | string | null
    auth: AuthCreateNestedOneWithoutStudentInput
    classes?: ClassRecordCreateNestedManyWithoutStudentInput
  }

  export type StAccountUncheckedCreateWithoutPlansInput = {
    s_id?: number
    auth_id: number
    name: string
    is_demo?: boolean
    updated_at?: Date | string | null
    classes?: ClassRecordUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StAccountCreateOrConnectWithoutPlansInput = {
    where: StAccountWhereUniqueInput
    create: XOR<StAccountCreateWithoutPlansInput, StAccountUncheckedCreateWithoutPlansInput>
  }

  export type PlanDescCreateWithoutRecordsInput = {
    plan_name: string
    desc?: string | null
    duration: number
    price: number
    sessionsIncluded: number
  }

  export type PlanDescUncheckedCreateWithoutRecordsInput = {
    plan_id?: number
    plan_name: string
    desc?: string | null
    duration: number
    price: number
    sessionsIncluded: number
  }

  export type PlanDescCreateOrConnectWithoutRecordsInput = {
    where: PlanDescWhereUniqueInput
    create: XOR<PlanDescCreateWithoutRecordsInput, PlanDescUncheckedCreateWithoutRecordsInput>
  }

  export type ClassRecordCreateWithoutPlanRecordInput = {
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
    teacher: TAccountCreateNestedOneWithoutClassesInput
    student: StAccountCreateNestedOneWithoutClassesInput
  }

  export type ClassRecordUncheckedCreateWithoutPlanRecordInput = {
    record_no?: number
    t_id: number
    s_id: number
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
  }

  export type ClassRecordCreateOrConnectWithoutPlanRecordInput = {
    where: ClassRecordWhereUniqueInput
    create: XOR<ClassRecordCreateWithoutPlanRecordInput, ClassRecordUncheckedCreateWithoutPlanRecordInput>
  }

  export type ClassRecordCreateManyPlanRecordInputEnvelope = {
    data: ClassRecordCreateManyPlanRecordInput | ClassRecordCreateManyPlanRecordInput[]
    skipDuplicates?: boolean
  }

  export type StAccountUpsertWithoutPlansInput = {
    update: XOR<StAccountUpdateWithoutPlansInput, StAccountUncheckedUpdateWithoutPlansInput>
    create: XOR<StAccountCreateWithoutPlansInput, StAccountUncheckedCreateWithoutPlansInput>
    where?: StAccountWhereInput
  }

  export type StAccountUpdateToOneWithWhereWithoutPlansInput = {
    where?: StAccountWhereInput
    data: XOR<StAccountUpdateWithoutPlansInput, StAccountUncheckedUpdateWithoutPlansInput>
  }

  export type StAccountUpdateWithoutPlansInput = {
    name?: StringFieldUpdateOperationsInput | string
    is_demo?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auth?: AuthUpdateOneRequiredWithoutStudentNestedInput
    classes?: ClassRecordUpdateManyWithoutStudentNestedInput
  }

  export type StAccountUncheckedUpdateWithoutPlansInput = {
    s_id?: IntFieldUpdateOperationsInput | number
    auth_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    is_demo?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    classes?: ClassRecordUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type PlanDescUpsertWithoutRecordsInput = {
    update: XOR<PlanDescUpdateWithoutRecordsInput, PlanDescUncheckedUpdateWithoutRecordsInput>
    create: XOR<PlanDescCreateWithoutRecordsInput, PlanDescUncheckedCreateWithoutRecordsInput>
    where?: PlanDescWhereInput
  }

  export type PlanDescUpdateToOneWithWhereWithoutRecordsInput = {
    where?: PlanDescWhereInput
    data: XOR<PlanDescUpdateWithoutRecordsInput, PlanDescUncheckedUpdateWithoutRecordsInput>
  }

  export type PlanDescUpdateWithoutRecordsInput = {
    plan_name?: StringFieldUpdateOperationsInput | string
    desc?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    sessionsIncluded?: IntFieldUpdateOperationsInput | number
  }

  export type PlanDescUncheckedUpdateWithoutRecordsInput = {
    plan_id?: IntFieldUpdateOperationsInput | number
    plan_name?: StringFieldUpdateOperationsInput | string
    desc?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    sessionsIncluded?: IntFieldUpdateOperationsInput | number
  }

  export type ClassRecordUpsertWithWhereUniqueWithoutPlanRecordInput = {
    where: ClassRecordWhereUniqueInput
    update: XOR<ClassRecordUpdateWithoutPlanRecordInput, ClassRecordUncheckedUpdateWithoutPlanRecordInput>
    create: XOR<ClassRecordCreateWithoutPlanRecordInput, ClassRecordUncheckedCreateWithoutPlanRecordInput>
  }

  export type ClassRecordUpdateWithWhereUniqueWithoutPlanRecordInput = {
    where: ClassRecordWhereUniqueInput
    data: XOR<ClassRecordUpdateWithoutPlanRecordInput, ClassRecordUncheckedUpdateWithoutPlanRecordInput>
  }

  export type ClassRecordUpdateManyWithWhereWithoutPlanRecordInput = {
    where: ClassRecordScalarWhereInput
    data: XOR<ClassRecordUpdateManyMutationInput, ClassRecordUncheckedUpdateManyWithoutPlanRecordInput>
  }

  export type TAccountCreateWithoutClassesInput = {
    name: string
    bio?: string | null
    rating?: number | null
    updated_at?: Date | string | null
    auth: AuthCreateNestedOneWithoutTeacherInput
    specs?: SpecializationCreateNestedManyWithoutTeachersInput
  }

  export type TAccountUncheckedCreateWithoutClassesInput = {
    t_id?: number
    auth_id: number
    name: string
    bio?: string | null
    rating?: number | null
    updated_at?: Date | string | null
    specs?: SpecializationUncheckedCreateNestedManyWithoutTeachersInput
  }

  export type TAccountCreateOrConnectWithoutClassesInput = {
    where: TAccountWhereUniqueInput
    create: XOR<TAccountCreateWithoutClassesInput, TAccountUncheckedCreateWithoutClassesInput>
  }

  export type StAccountCreateWithoutClassesInput = {
    name: string
    is_demo?: boolean
    updated_at?: Date | string | null
    auth: AuthCreateNestedOneWithoutStudentInput
    plans?: PlanRecordCreateNestedManyWithoutStudentInput
  }

  export type StAccountUncheckedCreateWithoutClassesInput = {
    s_id?: number
    auth_id: number
    name: string
    is_demo?: boolean
    updated_at?: Date | string | null
    plans?: PlanRecordUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StAccountCreateOrConnectWithoutClassesInput = {
    where: StAccountWhereUniqueInput
    create: XOR<StAccountCreateWithoutClassesInput, StAccountUncheckedCreateWithoutClassesInput>
  }

  export type PlanRecordCreateWithoutClassesInput = {
    joinAt?: Date | string
    sessionsRem: number
    isValid?: boolean
    student: StAccountCreateNestedOneWithoutPlansInput
    plan: PlanDescCreateNestedOneWithoutRecordsInput
  }

  export type PlanRecordUncheckedCreateWithoutClassesInput = {
    record_no?: number
    s_id: number
    plan_id: number
    joinAt?: Date | string
    sessionsRem: number
    isValid?: boolean
  }

  export type PlanRecordCreateOrConnectWithoutClassesInput = {
    where: PlanRecordWhereUniqueInput
    create: XOR<PlanRecordCreateWithoutClassesInput, PlanRecordUncheckedCreateWithoutClassesInput>
  }

  export type TAccountUpsertWithoutClassesInput = {
    update: XOR<TAccountUpdateWithoutClassesInput, TAccountUncheckedUpdateWithoutClassesInput>
    create: XOR<TAccountCreateWithoutClassesInput, TAccountUncheckedCreateWithoutClassesInput>
    where?: TAccountWhereInput
  }

  export type TAccountUpdateToOneWithWhereWithoutClassesInput = {
    where?: TAccountWhereInput
    data: XOR<TAccountUpdateWithoutClassesInput, TAccountUncheckedUpdateWithoutClassesInput>
  }

  export type TAccountUpdateWithoutClassesInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auth?: AuthUpdateOneRequiredWithoutTeacherNestedInput
    specs?: SpecializationUpdateManyWithoutTeachersNestedInput
  }

  export type TAccountUncheckedUpdateWithoutClassesInput = {
    t_id?: IntFieldUpdateOperationsInput | number
    auth_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    specs?: SpecializationUncheckedUpdateManyWithoutTeachersNestedInput
  }

  export type StAccountUpsertWithoutClassesInput = {
    update: XOR<StAccountUpdateWithoutClassesInput, StAccountUncheckedUpdateWithoutClassesInput>
    create: XOR<StAccountCreateWithoutClassesInput, StAccountUncheckedCreateWithoutClassesInput>
    where?: StAccountWhereInput
  }

  export type StAccountUpdateToOneWithWhereWithoutClassesInput = {
    where?: StAccountWhereInput
    data: XOR<StAccountUpdateWithoutClassesInput, StAccountUncheckedUpdateWithoutClassesInput>
  }

  export type StAccountUpdateWithoutClassesInput = {
    name?: StringFieldUpdateOperationsInput | string
    is_demo?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auth?: AuthUpdateOneRequiredWithoutStudentNestedInput
    plans?: PlanRecordUpdateManyWithoutStudentNestedInput
  }

  export type StAccountUncheckedUpdateWithoutClassesInput = {
    s_id?: IntFieldUpdateOperationsInput | number
    auth_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    is_demo?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plans?: PlanRecordUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type PlanRecordUpsertWithoutClassesInput = {
    update: XOR<PlanRecordUpdateWithoutClassesInput, PlanRecordUncheckedUpdateWithoutClassesInput>
    create: XOR<PlanRecordCreateWithoutClassesInput, PlanRecordUncheckedCreateWithoutClassesInput>
    where?: PlanRecordWhereInput
  }

  export type PlanRecordUpdateToOneWithWhereWithoutClassesInput = {
    where?: PlanRecordWhereInput
    data: XOR<PlanRecordUpdateWithoutClassesInput, PlanRecordUncheckedUpdateWithoutClassesInput>
  }

  export type PlanRecordUpdateWithoutClassesInput = {
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
    student?: StAccountUpdateOneRequiredWithoutPlansNestedInput
    plan?: PlanDescUpdateOneRequiredWithoutRecordsNestedInput
  }

  export type PlanRecordUncheckedUpdateWithoutClassesInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    s_id?: IntFieldUpdateOperationsInput | number
    plan_id?: IntFieldUpdateOperationsInput | number
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PlanRecordCreateManyStudentInput = {
    record_no?: number
    plan_id: number
    joinAt?: Date | string
    sessionsRem: number
    isValid?: boolean
  }

  export type ClassRecordCreateManyStudentInput = {
    record_no?: number
    t_id: number
    plan_record_id: number
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
  }

  export type PlanRecordUpdateWithoutStudentInput = {
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
    plan?: PlanDescUpdateOneRequiredWithoutRecordsNestedInput
    classes?: ClassRecordUpdateManyWithoutPlanRecordNestedInput
  }

  export type PlanRecordUncheckedUpdateWithoutStudentInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    plan_id?: IntFieldUpdateOperationsInput | number
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
    classes?: ClassRecordUncheckedUpdateManyWithoutPlanRecordNestedInput
  }

  export type PlanRecordUncheckedUpdateManyWithoutStudentInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    plan_id?: IntFieldUpdateOperationsInput | number
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ClassRecordUpdateWithoutStudentInput = {
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    teacher?: TAccountUpdateOneRequiredWithoutClassesNestedInput
    planRecord?: PlanRecordUpdateOneRequiredWithoutClassesNestedInput
  }

  export type ClassRecordUncheckedUpdateWithoutStudentInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    t_id?: IntFieldUpdateOperationsInput | number
    plan_record_id?: IntFieldUpdateOperationsInput | number
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClassRecordUncheckedUpdateManyWithoutStudentInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    t_id?: IntFieldUpdateOperationsInput | number
    plan_record_id?: IntFieldUpdateOperationsInput | number
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TAccountUpdateWithoutSpecsInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auth?: AuthUpdateOneRequiredWithoutTeacherNestedInput
    classes?: ClassRecordUpdateManyWithoutTeacherNestedInput
  }

  export type TAccountUncheckedUpdateWithoutSpecsInput = {
    t_id?: IntFieldUpdateOperationsInput | number
    auth_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    classes?: ClassRecordUncheckedUpdateManyWithoutTeacherNestedInput
  }

  export type TAccountUncheckedUpdateManyWithoutSpecsInput = {
    t_id?: IntFieldUpdateOperationsInput | number
    auth_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClassRecordCreateManyTeacherInput = {
    record_no?: number
    s_id: number
    plan_record_id: number
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
  }

  export type SpecializationUpdateWithoutTeachersInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type SpecializationUncheckedUpdateWithoutTeachersInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type SpecializationUncheckedUpdateManyWithoutTeachersInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ClassRecordUpdateWithoutTeacherInput = {
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    student?: StAccountUpdateOneRequiredWithoutClassesNestedInput
    planRecord?: PlanRecordUpdateOneRequiredWithoutClassesNestedInput
  }

  export type ClassRecordUncheckedUpdateWithoutTeacherInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    s_id?: IntFieldUpdateOperationsInput | number
    plan_record_id?: IntFieldUpdateOperationsInput | number
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClassRecordUncheckedUpdateManyWithoutTeacherInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    s_id?: IntFieldUpdateOperationsInput | number
    plan_record_id?: IntFieldUpdateOperationsInput | number
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PlanRecordCreateManyPlanInput = {
    record_no?: number
    s_id: number
    joinAt?: Date | string
    sessionsRem: number
    isValid?: boolean
  }

  export type PlanRecordUpdateWithoutPlanInput = {
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
    student?: StAccountUpdateOneRequiredWithoutPlansNestedInput
    classes?: ClassRecordUpdateManyWithoutPlanRecordNestedInput
  }

  export type PlanRecordUncheckedUpdateWithoutPlanInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    s_id?: IntFieldUpdateOperationsInput | number
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
    classes?: ClassRecordUncheckedUpdateManyWithoutPlanRecordNestedInput
  }

  export type PlanRecordUncheckedUpdateManyWithoutPlanInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    s_id?: IntFieldUpdateOperationsInput | number
    joinAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionsRem?: IntFieldUpdateOperationsInput | number
    isValid?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ClassRecordCreateManyPlanRecordInput = {
    record_no?: number
    t_id: number
    s_id: number
    link?: string | null
    startAt: Date | string
    endAt?: Date | string | null
  }

  export type ClassRecordUpdateWithoutPlanRecordInput = {
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    teacher?: TAccountUpdateOneRequiredWithoutClassesNestedInput
    student?: StAccountUpdateOneRequiredWithoutClassesNestedInput
  }

  export type ClassRecordUncheckedUpdateWithoutPlanRecordInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    t_id?: IntFieldUpdateOperationsInput | number
    s_id?: IntFieldUpdateOperationsInput | number
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClassRecordUncheckedUpdateManyWithoutPlanRecordInput = {
    record_no?: IntFieldUpdateOperationsInput | number
    t_id?: IntFieldUpdateOperationsInput | number
    s_id?: IntFieldUpdateOperationsInput | number
    link?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}