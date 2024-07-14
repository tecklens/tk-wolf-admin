try {
  const curScriptElement = document.currentScript;
  const url = new URL(curScriptElement.src);
  const params = url.searchParams;
  const task_id = params.get('tk_id')
  const trans_id = params.get('tx_id')
  const apiUrl = `https://flow.wolfx.app/wolf/v1/events/email/tracking/${task_id}?type=message.link_clicked&tx_id=${trans_id}`

  fetch(apiUrl).then(e => {
    console.log('init event')
  }).catch(e => {
    console.log('err fetch')
  })
} catch (e) {
  console.log('error fetch data')
}