/* eslint-disable react/no-array-index-key */
import { styled } from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex, Image } from '@kazama-defi/uikit'
import { useTranslation } from '@kazama-defi/localization'
import FoldableText from 'components/FoldableSection/FoldableText'
import { useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { isIfoSupported } from '@kazama-defi/ifos'
import { ChainId } from '@kazama-defi/sdk'

import { getChainBasedImageUrl } from 'views/Ifos/helpers'

import config from './config'

const ImageWrapper = styled.div`
  flex: none;
  order: 2;
  max-width: 414px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    order: 1;
    margin-top: 4rem;
  }
`

const DetailsWrapper = styled.div`
  order: 1;
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    order: 2;
    margin-bottom: 0;
    margin-left: 40px;
  }
`

const IfoQuestions = () => {
  const { t } = useTranslation()
  const { chainId: currentChainId } = useActiveChainId()
  const bunnyImageUrl = useMemo(() => {
    const chainId = isIfoSupported(currentChainId) ? currentChainId : ChainId.BSC
    return getChainBasedImageUrl({ chainId, name: 'faq-bunny' })
  }, [currentChainId])

  return (
    <Flex alignItems={['center', null, null, 'start']} flexDirection={['column', null, null, 'row']}>
      <ImageWrapper>
        <Image src={bunnyImageUrl} alt="ifo faq bunny" width={395} height={410} />
      </ImageWrapper>
      <DetailsWrapper>
        <Card>
          <CardHeader>
            <Heading scale="lg" color="secondary">
              {t('Details')}
            </Heading>
          </CardHeader>
          <CardBody>
            {config.map(({ title, description }, i, { length }) => {
              return (
                <FoldableText key={i} mb={i + 1 === length ? '' : '24px'} title={title}>
                  {description.map((desc, index) => {
                    return (
                      <Text key={index} color="textSubtle" as="p">
                        {desc}
                      </Text>
                    )
                  })}
                </FoldableText>
              )
            })}
          </CardBody>
        </Card>
      </DetailsWrapper>
    </Flex>
  )
}

export default IfoQuestions
