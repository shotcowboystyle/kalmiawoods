import { ref, watch } from 'vue';
/**
 *
 * import name = useStorage(name);
 *
 */

export function useStorage(key, defaultVal = null) {
  let storedVal = read();
  let val;

  if (storedVal) {
    val = ref(storedVal);
  } else {
    val = ref(defaultVal);
    write();
  }

  watch(val, write, { deep: true });

  function read() {
    return JSON.parse(localStorage.getItem(key));
  }

  function write() {
    if (val.value == null || val.value == '') {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(val.value));
    }
  }

  return val;
}
