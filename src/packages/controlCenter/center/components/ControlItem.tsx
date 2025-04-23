import styles from './ControlItem.module.scss';
interface Props {
  name: string;
  enabled: boolean;
  toggleEnable: (isOn: boolean) => void;
}
const ControlItem = (props: Props) => {
  const { name, enabled, toggleEnable } = props;
  return (
    <div className={`mb-[8px] h-[50px] w-[250px] ${styles.controlItemContainer}`}>
      <div
        className={`${styles.controlItem} flex cursor-pointer items-start rounded-l-[30px] rounded-r-[8px] p-2`}
        onClick={() => toggleEnable(!enabled)}
      >
        {/* <div
          className={`control-item-indicator mr-2.5 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ${getBackground()}`}
        >
          <img width={15} src={getExtensionAssetPath(icon)} className='select-none' />
        </div> */}

        <div className='flex flex-col justify-between self-stretch select-none'>
          <strong className='-mb-[3px] block text-sm leading-tight font-medium'>{name}</strong>
          <small className='text-xs text-gray-400'>{enabled ? `Enabled` : 'Disabled'}</small>
        </div>
      </div>
    </div>
  );
};
export default ControlItem;
