import { MagnifyingGlass } from 'phosphor-react'
import { SearchFormContainer } from './styles'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionsContext } from '../../../../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'
import { memo } from 'react';

/**
 * Por que um componente renderiza?
 * - Hooks changed (mudou, estado, contexto, reducer);
 * - Props changed (mudou propriedades);
 * - Parent Rerendered (componente pai renderizou);
 * 
 * Qual o fluxo de renderização?
 * 1. O React recria o HTML da interface daquele componente
 * 2. Compara a versão do HTML recriada com a versão anterior
 * 3. SE mudou alguna coisa, ele reescreve o HTML na tela
 * 
 * Se usarmos o memo, ele adiciona um fluxo a mais antes dos fluxos acima
 * Memo:
 * 0 - Hooks changed (os hooks mudaram?), props changes (as props mudaram?) [deep comparison = comparação profunda]
 * 0.1 - Comparar a versão anterior dos hooks e props
 * 0.2 - SE mudou algo, ele vai permitir a nova renderização e vai executasr começando do fluxo 1.
 */

const searchFormSchema = z.object({
  query: z.string(),
})

type SearchFormInputs = z.infer<typeof searchFormSchema>

export function SearchForm() {
  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.fetchTransactions
    },
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema),
  })

  async function handleSearchTransactions(data: SearchFormInputs) {
    await fetchTransactions(data.query)
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        type="text"
        placeholder="Busque por transações"
        {...register('query')}
      />

      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass size={20} />
        Buscar
      </button>
    </SearchFormContainer>
  )
}
