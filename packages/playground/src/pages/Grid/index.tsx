import './index.scss';

interface Props {}

function Grid(props: Props) {

  return <div className="grid-notes">
     <section>
       <h2>grid-auto</h2>
       <pre>
        <code>
          {
            `
              .grid {
                // 前两行高度
                grid-template-rows: 100px 200px;
                // 其他行高度
                grid-auto-rows: 100px;
                
                // 其他列宽度
                grid-auto-columns: 100px;
              }
            `
          }
        </code>
      </pre>
     </section>
    <section>
       <h2>fr, repeat, minmax</h2>
       <pre>
        <code>
          {
            `
              .grid {
                // 首尾两列50， 中间10列等分
                grid-template-columns: 50px repeat(10, 1fr) 50px;
                grid-auto-columns: 1fr;
                
                // 后一列是前一列的两倍，重复10次
                grid-auto-columns: repeat(10, 1fr 2fr)
                
               // minmax(最小值，最大值)
               grid-template-columns: minmax(max-content, 300px) minmax(200px, 1fr) 150px;
               
               // 当100%小于200px时，取100%，max同理
               grid-template-columns: minmax(max-content, 300px) minmax(min(100%, 200px), 1fr) 150px;
              }
            `
          }
        </code>
      </pre>
     </section>

    <section>
       <h2>合并行列(P3)</h2>
      <p><a href="//www.digitalocean.com/community/tutorials/css-css-grid-layout-span-keyword" target="_blank">more&gt;</a></p>
       <pre>
        <code>
          {
            `
              .grid {
                display: grid;
              }
              
              .grid>div:first { // 横跨4列(第一根线到第5根线)
                grid-column-start: 1;
                grid-column-start: 5;
                grid-column: 1/5; // 简写
                grid-column: 2/ span 4; // 简写 从第二根线开始，横跨4列
                grid-column: span 4; // 简写 从第一根线开始，横跨4列
              }
            `
          }
        </code>
      </pre>
     </section>

    <section>
       <h2>auto-fill & auto-fit(P8)</h2>
      <p><a href="//juejin.cn/post/6844903565463388168" target="_blank">more&gt;</a></p>
       <pre>
        <code>
          {
            `
              .grid {
                display: grid;
                // 12列平分，但最小250px, 容器装不下也不会换行(应为制定了必须要有12列)
                grid-template-columns: repeat(12, minmax(250px, 1fr) );
                
                // 装不下自动换行，auto-fill也一样
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr) );
                
                // 当父容器足够宽时，auto-fit会拉伸子元素撑满剩余空间，auto-fill该啥样还是啥样
              }
            `
          }
        </code>
      </pre>
     </section>

    <section>
      <h2>网格(区域/线)命名(P9-p10)</h2>
      <h2>网格轨道对齐规则(p11)</h2>
    </section>
  </div>
}

export default Grid;