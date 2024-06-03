import Moveable from 'react-moveable'
import { Frame } from 'scenejs'
import './moveable.css'
import React, { useEffect, useRef, useState } from 'react'
import LayoutToolbar, { toolbars } from '@/components/moveable/Toolbar.tsx'
import { HotkeysProvider } from 'react-hotkeys-hook'
import { useLayout } from '@/lib/store/layoutStore.ts'
import { DimensionViewable, DimensionViewableProps } from './DimensionViewable'
import { getId } from '@/components/moveable/MoveableData.tsx'
import { ElementInfo, MovedResult } from './layout.interface'
import Selecto from 'react-selecto'
import { IObject } from '@daybrush/utils'
import Viewport from '@/components/moveable/Viewport.tsx'
import InfiniteViewer from 'react-infinite-viewer'
import InfiniteContainer from '@/components/moveable/infinite-container.tsx'
import { Rect } from 'reactflow'
import Memory from '@/components/moveable/Memory.ts'

function getParnetScenaElement(el: HTMLElement | SVGElement): HTMLElement | SVGElement | null {
  if (!el) {
    return null
  }
  if (el.hasAttribute('data-scena-element-id')) {
    return el
  }
  return getParnetScenaElement(el.parentElement as HTMLElement | SVGElement)
}

function checkInput(target: HTMLElement | SVGElement) {
  const tagName = target.tagName.toLowerCase()

  return (target as HTMLElement).isContentEditable || tagName === 'input' || tagName === 'textarea'
}

function getContentElement(el: HTMLElement): HTMLElement | null {
  // if (el.contentEditable === 'inherit') {
  //   return getContentElement(el.parentElement!)
  // }
  if (el.contentEditable === 'true') {
    return el
  }
  return null
}

function getIds(els: Array<HTMLElement | SVGElement>): string[] {
  return els.map(el => getId(el))
}

export default function LayoutEditor() {
  const infiniteViewer = React.createRef<InfiniteViewer>()
  const ref = useRef<HTMLDivElement>(null)
  const [targets, setTargets] = React.useState<any[]>([])
  const [frames, setFrames] = React.useState<any>(null)
  const moveableRef = React.useRef<Moveable<DimensionViewableProps>>(null)
  const onWindowResize = React.useCallback(() => {
    moveableRef.current?.updateTarget()
  }, [])
  const {
    memory,
    selectedMenu,
    moveableData,
    setSelectedMenu,
    eventBus,
    historyManager,
  } = useLayout()
  const [selectedTargets] = useState<Array<HTMLElement | SVGElement>>([])
  const selecto = React.createRef<Selecto>()
  const viewport = React.createRef<Viewport>()

  function checkImageLoaded(el: HTMLElement | SVGElement): Promise<any> {
    if (el.tagName.toLowerCase() !== 'img') {
      return Promise.all([].slice.call(el.querySelectorAll('img')).map(el => checkImageLoaded(el)))
    }
    return new Promise(resolve => {
      if ((el as HTMLImageElement).complete) {
        resolve(1)
      } else {
        el.addEventListener('load', function loaded() {
          resolve(1)

          el.removeEventListener('load', loaded)
        })
      }
    })
  }

  function setSelectedTargets(
    targets: Array<HTMLElement | SVGElement>,
    isRestore?: boolean,
  ) {
    targets = targets.filter((target) => {
      return targets.every((parnetTarget) => {
        return parnetTarget === target || !parnetTarget.contains(target)
      })
    })

    if (!isRestore) {
      const prevs = getIds(moveableData.getSelectedTargets())
      const nexts = getIds(targets)

      if (
        prevs.length !== nexts.length ||
        !prevs.every((prev, i) => nexts[i] === prev)
      ) {
        historyManager.addAction('selectTargets', { prevs, nexts })
      }
    }
    selecto.current!.setSelectedTargets(targets)
    moveableData.setSelectedTargets(targets)
    eventBus.trigger('setSelectedTargets')
  }

  function appendComplete(infos: ElementInfo[], isRestore?: boolean) {
    !isRestore &&
    historyManager.addAction('createElements', {
      infos,
      prevSelected: getIds(targets),
    })
    const data = moveableData
    const newTargets = infos
      .map(function registerFrame(info) {
        data.createFrame(info.el!, info.frame)
        data.render(info.el!)

        info.children!.forEach(registerFrame)
        return info.el!
      })
      .filter((el, idx) => {
        el.className = `target target${(targets.length ?? 0) + idx + 1}`
        return el
      })

    return Promise.all(newTargets.map((target) => checkImageLoaded(target))).then(
      () => {
        setTargets(prevState => [...prevState, ...newTargets])

        return newTargets
      },
    )
  }

  function getViewport() {
    return viewport.current!
  }

  function restoreFrames(infos: ElementInfo[], frameMap: IObject<any>) {
    const viewport = getViewport()

    infos.forEach(function registerFrame(info) {
      info.frame = frameMap[info.id!]
      delete frameMap[info.id!]

      info.children!.forEach(registerFrame)
    })
    for (const id in frameMap) {
      moveableData.createFrame(viewport.getInfo(id).el!, frameMap[id])
    }
  }

  function appendJSX(info: ElementInfo) {
    return appendJSXs([info]).then((targets) => targets[0])
  }

  function appendJSXs(
    jsxs: ElementInfo[],
    isRestore?: boolean,
  ): Promise<Array<HTMLElement | SVGElement>> {
    const viewport = getViewport()
    console.log(targets)
    const indexesList = viewport.getSortedIndexesList(
      selectedTargets,
    )
    const indexesListLength = indexesList.length
    let appendIndex = -1
    let scopeId: string = ''

    if (!isRestore && indexesListLength) {
      const indexes = indexesList[indexesListLength - 1]

      const info = viewport.getInfoByIndexes(indexes)

      scopeId = info.scopeId!
      appendIndex = indexes[indexes.length - 1] + 1
    }

    console.log('append jsxs', jsxs, appendIndex, scopeId)

    return getViewport()
      .appendJSXs(jsxs, appendIndex, scopeId)
      .then(({ added }) => {
        return appendComplete(added, isRestore)
      })
  }

  function selectEndMaker(rect: any) {
    const iV = infiniteViewer.current!
    const selectedMarker: any = toolbars.find(e => e.value === selectedMenu)?.maker
    const width = rect.width
    const height = rect.height

    if (!selectedMenu || !selectedMarker || !width || !height) {
      return false
    }
    const maker = selectedMarker(memory)
    const scrollTop = -iV.getScrollTop()
    const scrollLeft = -iV.getScrollLeft()
    const offset = ref.current?.getBoundingClientRect()
    const top = rect.top - scrollTop - (offset?.top ?? 0)
    const left = rect.left - scrollLeft - (offset?.left ?? 0)


    const style = {
      top: `${top}px`,
      left: `${left}px`,
      position: 'absolute',
      width: `${width}px`,
      height: `${height}px`,
      ...maker.style,
    } as any
    appendJSX({
      jsx: maker.tag,
      attrs: maker.attrs,
      name: `(${selectedMenu})`,
      frame: style,
    }).then((target: HTMLElement | SVGElement) => {
      if (selectedMenu === 'Text') {
        target.focus()
      }
    })
    return true
  }

  function move(deltaX: number, deltaY: number) {
    moveableRef.current?.request('draggable', { deltaX, deltaY }, true)
  }

  function removeFrames(targets: Array<HTMLElement | SVGElement>) {
    const frameMap: IObject<any> = {}
    const viewport = getViewport()

    targets.forEach(function removeFrame(target) {
      const info = viewport.getInfoByElement(target)!

      frameMap[info.id!] = moveableData.getFrame(target).get()
      moveableData.removeFrame(target)

      info.children!.forEach((childInfo) => {
        removeFrame(childInfo.el!)
      })
    })

    return frameMap
  }

//
//   function checkBlur() {
//     const activeElement = document.activeElement
//     if (activeElement) {
//       (activeElement as HTMLElement).blur()
//     }
//     const selection = document.getSelection()!
//
//     if (selection) {
//       selection.removeAllRanges()
//     }
//     eventBus.trigger('blur')
//   }
//

  function checkBlur() {
    const activeElement = document.activeElement
    if (activeElement) {
      (activeElement as HTMLElement).blur()
    }
    const selection = document.getSelection()!

    if (selection) {
      selection.removeAllRanges()
    }
    eventBus.trigger('blur')
  }

  function onBlur(e: any) {
    const target = e.target as HTMLElement | SVGElement

    if (!checkInput(target)) {
      return
    }
    const parentTarget = getParnetScenaElement(target)

    if (!parentTarget) {
      return
    }
    const info = getViewport().getInfoByElement(parentTarget)!

    if (!info.attrs!.contenteditable) {
      return
    }
    const nextText = (parentTarget as HTMLElement).innerText

    if (info.innerText === nextText) {
      return
    }
    historyManager.addAction('changeText', {
      id: info.id,
      prev: info.innerText,
      next: nextText,
    })
    info.innerText = nextText
  }

  function moveInside() {
    let targets = selectedTargets

    const length = targets.length
    if (length !== 1) {
      return
    }
    targets = [targets[0]]

    const viewport = getViewport()
    const frameMap = removeFrames(targets)

    return viewport
      .moveInside(targets[0])
      .then((result) => moveComplete(result, frameMap))
  }

  function moveOutside() {
    let targets = selectedTargets

    const length = targets.length
    if (length !== 1) {
      return
    }
    targets = [targets[0]]

    const frameMap = removeFrames(targets)
    getViewport()
      .moveOutside(targets[0])
      .then((result) => moveComplete(result, frameMap))
  }

  function moveComplete(
    result: MovedResult,
    frameMap: IObject<any>,
    isRestore?: boolean,
  ) {
    console.log('Move', result)

    const { moved, prevInfos, nextInfos } = result
    restoreFrames(moved, frameMap)

    if (moved.length) {
      if (!isRestore) {
        historyManager.addAction('move', {
          prevInfos,
          nextInfos,
        })
      }
      // * move complete
      appendComplete(moved, true)
    }

    return result
  }

  useEffect(() => {
    memory.set('background-color', '#4af')
    memory.set('color', '#333')
  }, [])

  return (
    <HotkeysProvider initiallyActiveScopes={['settings']}>
      <div className={'overflow-hidden relative border border-gray-300 bg-gray-100 rounded-lg'}>
        <div className="page h-[500px]" ref={ref} id={'layout-editor'}>
          <InfiniteContainer
            ref={infiniteViewer}
            viewport={viewport}
          >
            <Viewport
              ref={viewport}
              onBlur={onBlur}
              style={{
                width: `${500}px`,
                height: `${500}px`,
              }}
            >
              <Moveable<DimensionViewableProps>
                ref={moveableRef}
                target={targets}
                ables={[DimensionViewable]}
                dimensionViewable={true}
                pinchThreshold={20}
                // container={ref.current}
                keepRatio={true}
                draggable={true}
                scalable={true}
                rotatable={true}
                origin={false}
                snappable={true}
                snapGap={false}
                roundable={true}
                scrollable={true}

                throttleDrag={1}
                throttleRotate={0.2}
                throttleResize={1}
                throttleScale={0.01}

                onBeforeRenderStart={moveableData.onBeforeRenderStart}
                onBeforeRenderGroupStart={moveableData.onBeforeRenderGroupStart}
                onDragStart={moveableData.onDragStart}
                onDrag={moveableData.onDrag}
                onDragGroupStart={moveableData.onDragGroupStart}
                onDragGroup={moveableData.onDragGroup}

                onScaleStart={moveableData.onScaleStart}
                onScale={moveableData.onScale}
                onScaleGroupStart={moveableData.onScaleGroupStart}
                onScaleGroup={moveableData.onScaleGroup}

                onResizeStart={moveableData.onResizeStart}
                onResize={moveableData.onResize}
                onResizeGroupStart={moveableData.onResizeGroupStart}
                onResizeGroup={moveableData.onResizeGroup}

                onRotateStart={moveableData.onRotateStart}
                onRotate={moveableData.onRotate}
                onRotateGroupStart={moveableData.onRotateGroupStart}
                onRotateGroup={moveableData.onRotateGroup}

                defaultClipPath={memory.get('crop') || 'inset'}
                onClip={moveableData.onClip}

                onDragOriginStart={moveableData.onDragOriginStart}
                onDragOrigin={e => {
                  moveableData.onDragOrigin(e)
                }}

                onRound={moveableData.onRound}

                onClick={e => {
                  const target = e.inputTarget as any
                  if (e.isDouble && target.isContentEditable) {
                    setSelectedMenu('Text')
                    const el = getContentElement(target)

                    if (el) {
                      el.focus()
                    }
                  }
                }}
                onClickGroup={e => {
                  selecto.current!.clickTarget(e.inputEvent, e.inputTarget)
                }}

                clippable={selectedMenu === 'Crop'}
                dragArea={selectedTargets.length > 1 || selectedMenu !== 'Text'}
                checkInput={selectedMenu === 'Text'}

                onRenderStart={e => {
                  e.datas.prevData = moveableData.getFrame(e.target).get()
                }}
                onRender={e => {
                  e.datas.isRender = true
                  eventBus.requestTrigger('render')
                }}
                onRenderEnd={e => {
                  eventBus.requestTrigger('render')

                  if (!e.datas.isRender) {
                    return
                  }
                  historyManager.addAction('render', {
                    id: getId(e.target),
                    prev: e.datas.prevData,
                    next: moveableData.getFrame(e.target).get(),
                  })
                }}
                onRenderGroupStart={e => {
                  e.datas.prevDatas = e.targets.map(target => {
                    return moveableData.getFrame(target).get()
                  })
                }}
                onRenderGroup={e => {
                  eventBus.requestTrigger('renderGroup', e)
                  e.datas.isRender = true
                }}
                onRenderGroupEnd={e => {
                  eventBus.requestTrigger('renderGroup', e)

                  if (!e.datas.isRender) {
                    return
                  }
                  const prevDatas = e.datas.prevDatas
                  const infos = e.targets.map((target, i) => {
                    return {
                      id: getId(target),
                      prev: prevDatas[i],
                      next: moveableData.getFrame(target).get(),
                    }
                  })
                  historyManager.addAction('renders', {
                    infos,
                  })
                }}
              />
            </Viewport>
          </InfiniteContainer>
          <Selecto
            ref={selecto}
            container={ref.current}
            hitRate={0}
            selectableTargets={targets}
            selectByClick={true}
            selectFromInside={false}
            toggleContinueSelect={['shift']}
            preventDefault={true}
            // scrollOptions={
            //   ref.current
            //     ? {
            //       container: infiniteViewer.current?.getContainer(),
            //       threshold: 30,
            //       throttleTime: 30,
            //       getScrollPosition: () => {
            //         const current = infiniteViewer.current!
            //         return [current.getScrollLeft(), current.getScrollTop()]
            //       },
            //     }
            //     : undefined
            // }
            onDragStart={(e) => {
              console.log('drag start')
              const inputEvent = e.inputEvent
              const target = inputEvent.target

              checkBlur()
              if (selectedMenu === 'Text' && target.isContentEditable) {
                const contentElement = getContentElement(target)

                if (
                  contentElement &&
                  contentElement?.hasAttribute('data-scena-element-id')
                ) {
                  e.stop()
                  setSelectedTargets([contentElement])
                }
              }
              // if (
              //   (inputEvent.type === 'touchstart' && e.isTrusted) ||
              //   moveableRef.current?.isMoveableElement(target) ||
              //   selectedTargets.some(
              //     (t) => t === target || t.contains(target),
              //   )
              // ) {
              //   e.stop()
              // }
            }}
            onScroll={({ direction }) => {
              infiniteViewer.current!.scrollBy(
                direction[0] * 10,
                direction[1] * 10,
              )
            }}
            onSelectEnd={({ isDragStart, selected, inputEvent, rect }: {
              rect: any,
              isDragStart: boolean,
              selected: any,
              inputEvent: any
            }) => {
              if (isDragStart) {
                inputEvent.preventDefault()
              }
              if (selectEndMaker(rect)) {
                return
              }
              setSelectedTargets(selected)
              if (!isDragStart) {
                return
              }
              moveableRef.current?.dragStart(inputEvent)
            }}
          ></Selecto>
          <div className="container">
          </div>
        </div>

        <LayoutToolbar />
      </div>
    </HotkeysProvider>
  )
}