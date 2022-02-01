import {useForm} from 'react-hook-form'

// 簡単な例
type Language = 'TypeScript' | 'Python';

type HelloLanguage = `Hello ${Language}`;
// OK
const helloTypeScript: HelloLanguage = 'Hello TypeScript';
// Error
const helloGolang: HelloLanguage = 'Hello Golang';

// React Hook Formの例
type User = {
  name: string;
  skill: {
    languages: {
      name: Language;
      years: number;
    }[];
  };
}
const { watch } = useForm<User>({
  defaultValues: {
    name: 'nakazato',
    skill: {
      languages: [
        {
          name: 'TypeScript',
          years: 1.5,
        },
        {
          name: 'Python',
          years: 4,
        },
      ]
    }
  }
})
// なんとLanguage型として認識されている！！
const myFavoriteLanguage = watch('skill.languages.0.name');

// 配列かどうか判別する
type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type IsArray<T extends Array<any>> = number extends T['length'] ? false : true;

// Path型を定義していく
const languageName:Path<User> = 'skill.languages.0.name'
// PathImplとPathで再起的にフィールドのパスを表現
// Userの場合CurrentPath=skillならRestValuesはUser['skill']を表現するために使う
// RestValuesがプリミティブ型の場合はそれ以上パスを繋げられないのでCurrentPathを返す
// RestValuesがプリミティブ型でない場合はCurrentPathか
// CurrentPathとRestValuesのパス(Path<RestValues>)を繋げた型を返す
type PathImpl<CurrentPath extends string | number, RestValues> =
  RestValues extends Primitive
  ? `${CurrentPath}`
  : `${CurrentPath}` | `${CurrentPath}.${Path<RestValues>}`;

type Path<T> = T extends Array<infer ArrayItem>
  ? 
  // TがArrayならnumberとnumber.${配列の要素のパス}の複合型返す。
  PathImpl<number, ArrayItem>
  :
  // TがArrayでないなら全てのフィールド名と
  // フィールド名とPath<T[フィールド名]>を繋げたものの複合型を返す
  {
    [K in keyof T]: PathImpl<K & string, T[K]>;
  }[keyof T];

