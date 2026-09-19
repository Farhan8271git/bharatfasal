import CardHeader from "../../../components/ui/CardHeader";

/** Render the settings heading for the active account role. */
export default function SettingsHeader({ roleInfo }) {
  const RoleIcon = roleInfo.icon;

  return (
    <CardHeader
      icon={RoleIcon}
      iconClass={roleInfo.color}
      iconBg={roleInfo.bg}
      title={roleInfo.title}
      subtitle={roleInfo.subtitle}
    />
  );
}
