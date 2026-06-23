const fs = require('fs');
const path = 'd:/wamp64/www/aura/aura/src/components/generated/HubPages.tsx';
let content = fs.readFileSync(path, 'utf8');
const target = "  const { data: siteLogs, setData: setSiteLogs } = useApiData('sitelogs');\n  const [newLogOpen, setNewLogOpen] = useState(false);\n  const [newIssueOpen, setNewIssueOpen] = useState(false);";
const replacement = "  const { data: siteLogs, setData: setSiteLogs } = useApiData('sitelogs');\n  const { data: siteUpdates, setData: setSiteUpdates } = useApiData('siteupdates');\n  const [newClientUpdateOpen, setNewClientUpdateOpen] = useState(false);\n  const [clientUpdateForm, setClientUpdateForm] = useState({ title: '', phase: '', description: '', photos: [] as string[] });\n  const [newLogOpen, setNewLogOpen] = useState(false);\n  const [newIssueOpen, setNewIssueOpen] = useState(false);";
if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Replaced exact match using \n');
} else {
  const target2 = "  const { data: siteLogs, setData: setSiteLogs } = useApiData('sitelogs');\r\n  const [newLogOpen, setNewLogOpen] = useState(false);\r\n  const [newIssueOpen, setNewIssueOpen] = useState(false);";
  const replacement2 = "  const { data: siteLogs, setData: setSiteLogs } = useApiData('sitelogs');\r\n  const { data: siteUpdates, setData: setSiteUpdates } = useApiData('siteupdates');\r\n  const [newClientUpdateOpen, setNewClientUpdateOpen] = useState(false);\r\n  const [clientUpdateForm, setClientUpdateForm] = useState({ title: '', phase: '', description: '', photos: [] as string[] });\r\n  const [newLogOpen, setNewLogOpen] = useState(false);\r\n  const [newIssueOpen, setNewIssueOpen] = useState(false);";
  if (content.includes(target2)) {
    content = content.replace(target2, replacement2);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Replaced exact match using \r\n');
  } else {
    console.log('Target not found with \n or \r\n');
  }
}
